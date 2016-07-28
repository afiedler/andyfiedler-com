---
layout: post
title: A Better $patch Method for Angular's ngResource
redirect_from:
  - /blog/a-better-patch-method-for-angulars-ngresource-373/
  - /blog/a-better-patch-method-for-angulars-ngresource-373/
---

Angular's ngResource makes a pretty decent starting point for developing a front-end model layer, but tends to be a little simplistic as your backend API gets more sophisticated.

One issue I ran into recently is that the `$patch` method sends the entire object in the request body. This is usually not what you want to do, because the PATCH method is [designed for a partial resource modification](https://tools.ietf.org/html/rfc5789), typically using something like [JSON Merge Patch](https://tools.ietf.org/html/rfc7386) or [JSON Patch](https://tools.ietf.org/html/rfc6902) as the request body.

Here's how to add a `$patchFields` method to your resource that creates a JSON Merge Patch for a set of fields, and then sends it to the backend.

This is how you'd use it:

```js
var product = new Product({
   id: 231
   name: 'iPad',
   price: 429.99,
   size: {
      height: 9.4,
      width: 6.2,
      depth: 0.2
   }
});

product.price = 400;
product.size.height = 10;

var promise = product.$patchFields(['price', 'size.height']);

/*
 * Sends a request like this:
 * PATCH http://api.example.com/products/231
 * {
 *    "price": 400,
 *    "size": {
 *       "height": 10
 *    }
 * }
 *
 */
```

And here's the code:

```js
angular.module('myApp').factory('Product', function($resource) {

   var Product = $resource(
      'http://api.example.com/products/:id',
      { id: 'id' }
   );

   angular.extend(Product.prototype, {
      '$patchFields': function(fields, success, error) {
         var self = this;
         patch = self.generatePatch(fields);
         var result = Product.patch.call(
            this,
            { id: self.id },
            patch,
            success,
            error
         );
         return result.$promise || result;
      },
      generatePatch: function(fields) {
         var self = this;
         if(!angular.isArray(fields)) {
            fields = [ fields ];
         }

         return fields.reduce(function(result, fields) {
            setFieldByPath(result, field, self.getFieldByPath(field));
            return result;
         }, {});
      },
      getFieldByPath: function(path) {
         var ret = angular.toJson(json);
         var paths = path.split('.');
         for(var i = 0; i < paths.length; ++i) {
            if(angular.isUndefined(ret[paths[i]])) {
               return undefined;
            } else {
               ret = ret[paths[i]];
            }
         }
         return ret;
      }
   });

   function setFieldByPath(obj, path, value) {
      var paths = path.split('.');
      vat setOn = obj;

      for(var i = 0; i < paths.length - 1; i++) {
         var path = paths[i];
         if(!angular.isUndefined(setOn[path])) {
            if(
               angular.isObject(setOn[path]) &&
               !angular.isArray(setOn[path])
            ) {
               setOn = setOn[path];
            } else {
               throw new Error(
                  'Path ' +
                  path +
                  ' has an item that is not an object'
               );
            }
         } else {
            setOn[path] = {};
            setOn = setOn[path];
         }
      }

      if(!angular.isFunction(setOn[paths[paths.length - 1]])) {
         setOn[paths[paths.length - 1]] = value;
      } else {
         throw new Error(
            'Cannot set value at ' +
            path +
            ' since it would overwrite a function'
         );
      }
   }

   return Product;

});
```
