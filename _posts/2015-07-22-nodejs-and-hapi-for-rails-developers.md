---
layout: post
status: publish
published: true
title: NodeJS and Hapi for Rails Developers
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 324
wordpress_url: http://andyfiedler.com/?p=324
date: '2015-07-22 09:59:48 -0400'
date_gmt: '2015-07-22 13:59:48 -0400'
categories:
- Tech Notes
tags:
- rails
- nodejs
- hapi
---
This post is an **work in progress** list of tips and tricks I've learned working on a HapiJS API after mostly coding Rails APIs for the last few years. I expect to update it as I learn more.

If you are a Rails developer looking to transition to NodeJS, hopefully this will save you some time. If you are a more seasoned NodeJS or Hapi developer and have suggestions for improving this, please let me know in the comments.

## Async Programming

### Error-first callbacks, promises, or `async`/`await`
Most Rails developers have written some Javascript, so you are probably familiar with callbacks. On the client, having nested callbacks is relatively rare. On the server, however, they are far more common. A simple example would be a server method that needs to make a handful of database calls, with all of the depending on the outcome of the others. This would be trivial to write in a sequential way, but with NodeJS, you will need to nest callbacks to accomplish the same thing.

This is both the best thing about NodeJS and the most annoying. It makes things very performant, because with callbacks you continually return control to the main event loop, freeing the main thread to move on to other things. In Rails, unless you are using a threaded server like Puma, waiting on a database call will block the entire process.

All of Node core and most of the libraries use error-first callbacks. If the first argument to the callback function is truthy, then you know the callback has failed with an error. You'll see a lot of code in NodeJS like this:

```javascript
var myCallbackFunction = function(options, function(err, result) {
   if(err) return err;
   // process the result
});
```

This gets nasty when you have many nested callbacks and has been dubbed "callback hell".

One way to fix this is to use a promise. You can typically turn any error-first callback function into a promise-returning function with `Promise.promisify()`.

```javascript
var Promise = require('bluebird'); // bluebird is a popular promise library
var myAsyncFunction = Promise.promisify(myCallbackFunction);

myAsyncFunction(options).then(function(result) {
   // process result
}).catch(function(err) {
   // process error
});
```

This doesn't look Earth-shattering, but promises can make deeply nested callbacks more readable. I like promises from my AngularJS programming, but they aren't widely used in the Node community. If you attempt to use them, you feel like you are fighting an uphill battle since everyone still uses error-first callbacks. They can be vital in some situations, however.

#### ES7 and `async`/`await`
The next generation of Javascript will hopefully solve all of our problems with the addition of two new keywords: `async` and `await`. These use promises under the hood, but you can use `try`-`catch` and don't need `then()`:

```javascript
try {
   var result = await myAsyncFunction(options);
   // process result
} catch (ex) {
   // handle error
}
```

You can use this today if you transpile with the Traceur compiler, but not much of the Node community is doing that yet. Once more people get on board, this will be a *huge* improvement in Javascript.

#### What do do today?
Today, I think you should stick with error-first callbacks and use promises if absolutely necessary. Another library you can look into is the [`async`](https://github.com/caolan/async) library, which gives you lots of nice functions to handle many callbacks in series or parallel.

## Unit Testing

### NPM packages to use
 * [Lab](https://github.com/hapijs/lab) - Hapi's unit testing framework. It supports both TestUnit and RSpec style tests. I'm using the RSpec style.
 * [Code](https://github.com/hapijs/code) - An assertion library. This handles `expect` statements. There are a [few gotchas](http://andyfiedler.com/blog/gotchas-with-hapis-code-library-327/).

### Test folder setup
I'm using RSpec style tests, so my folder hierarchy looks like this:

```
+ /
|
+---specs
|
+---requests
| |
| +---users
| |
| +---get.js
|
+---models
|
+---user.js
```

### Running your specs
To run your specs, you have two choices. You can either install lab globally and run them with the `lab` command, or you can change your `package.json` file to set what to run for `npm test`. I usually do the second options, because it lets me specify some default options for lab. Here's what the section of `package.json` file looks like:

```json
{
   "scripts": {
      "test": "env $(cat .env | xargs) lab -v -L -m 0"
   }
}
```

The `xargs` part is to set the environmental variables before running the tests from the `.env` file. There probably is a better way to do this, but that is working for now.
