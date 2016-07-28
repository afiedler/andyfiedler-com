---
layout: post
status: publish
published: true
title: Refactoring an Existing NodeJS App for ES2015 (Part 1)
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 356
wordpress_url: http://andyfiedler.com/?p=356
date: '2016-01-13 11:12:53 -0500'
date_gmt: '2016-01-13 16:12:53 -0500'
categories:
- Tech Notes
tags:
- nodejs
- es2015
---
Thinking of getting started with ES2015? Coding with NodeJS v5.0.0 or higher? You can get started today! Node supports many features of ES2015 natively, without the need for a transpiler like Babel or Traceur.

ES2015 actually has a *lot* of really awesome features, and I think most of them are worthwhile to start using eventually. But, it you already have a Node app written and want to introduce ES2015 gradually, which features should you pick first?

This post talks about the three ES2015 features that I would focus on first. I picked these because they are the most compatible with existing patterns and are the easiest for developers to pick up and start using right away. They are also all supported fully in Node 5.x.

The features are:

1. Block-scoped declarations (`let` and `const`)
2. Arrow functions
3. Template strings and new `String` methods

Part 2 will of this series will talk about classes.

## Start using block-scoped variable declarations (`let` and `const`) instead of `var`

**Note:** You need to be in strict mode (`'use strict'`) for these keywords to work. If you are using the Node REPL, you need to start it with `node --use_strict` as opposed to typing `'use strict';` within the REPL.

### What is this `let` business?
The `var` keyword has a few issues that have been corrected by the new `let` keyword. First of all, `var` may be hoisted like this:

```js
bla = 2;
var bla;

// is identical to:
var bla;
bla = 2;
```

Second of all, `var`-defined variables have the scope of *entire* enclosing function.

```js
function varExample() {
  var x = 1;
  if (true) {
    var x = 2;  // same variable!
    console.log(x);  // 2
  }
  console.log(x);  // 2
}
```

The `let` keyword avoids all of this weirdness. When you use `let` there is no hoisting, so you will get a ReferenceError at runtime:

```js
function a() {
   c = 1;
   let c = 2;
   return c;
}
a(); // ReferenceError: c is not defined
```

Variables declared with `let` are block-scoped, not function scoped. A block is any section of code delimited with `{ ... }`. Here's an example:

```js
let x = 1;
let y = 2;
if (y > x) {
  let a = 3;
  x = a;
}
console.log(x); // 3
console.log(y); // 2
console.log(a); // ReferenceError: a is not defined.
```

### What about `const`?
The `const` keyword follows the same scoping and (non-) hoisting rules as `let`. It has one more constraint, though: variables declared with `const` don't change their reference.

Here's a few examples:

```js
const A = 1;
A = 2;   // TypeError: assignment to a constant variable
```

It's also important to realize that `const` doesn't enforce immutability for objects. You *can* change object properties of objects declared with `const`:

```js
'use strict';
const MY_OBJECT = {
   MyProp: 1
};
MY_OBJECT.MyProp = 2; // no error here!
console.log(MY_OBJECT.MyProp); // 2
```

### Refactoring recommendation
> If it is possible to use `const`, use it. If it isn't possible to use `const`, use `let`. Don't use `var` anymore, unless you find some crazy edge-case where it is necessary.

## Arrow functions
Arrow functions are a shorthand for writing small, anonymous functions. They also adopt the scope of their surrounding code, rather than creating a new one. This can eliminate use of the `var self = this;` pattern, and eliminate some uses of `.bind()`.

Arrow functions also have a further-shortened version for implicitly returning the value of an expression. This is great for iterators and lodash-style functional programming.

Here are some examples:

```js
let myArray = [1, 2, 3];
// These are all equivalent:
myArray.map(function(i) { return i + 1; })
myArray.map((i) => { return i + 1; });
myArray.map((i) => { i + 1; });
myArray.map((i) => (i + 1));
myArray.map((i) => i + 1); // expression (i + 1) must be on one line
myArray.map(i => i + 1); // also must be on one line
// all return [2, 3, 4]
```

Here's an example of the way `this` works with arrow functions:

```js
function Person () {
   this.age = 0;
   setInterval(function() { this.age++; }, 1000);
}
let p = new Person();
p.age; // -> 0
// (wait a few seconds)
p.age; // -> still 0
```

You could fix this with `self`, but that is annoying. Arrow functions make this easier:

```js
function Person() {
   this.age = 0;
   setInterval(() => { this.age++; }, 1000);
}
let p = new Person();
// (wait a few seconds)
p.age // -> not zero
```

There are a few other differences with arrow functions that are more obscure:

* Within the arrow function, `arguments` refers to the surrounding function, not to the argument list of the arrow function.
* `.call()`, `.bind()`, and `.apply()` cannot change the scope of an arrow function. They still work otherwise (and have the same function signatures themselves). If you use them, `this` within the arrow function will just be unchanged.

### Refactoring recommendation
> Use arrow functions extensively. They are way better. One important thing to note, however, is that you still must use the anonymous-function syntax for method declarations:
> ```
> let MyClass = BaseClass.extend({
>    myMethod: function() {
>       return 'the return';
>    }
> });
> ```

## Template strings
Template strings are common in other programming languages (Like PHP, Python, and Ruby). They let you avoid code like this, which is extremely prone to errors and typos:

```js
let now = month + ' ' + day + ', ' + year + ' ' + hour + ':' + minute;
```

With template strings you can write:

```js
let now = `${month} ${day}, ${year} ${hour}:${minute}`;
```

Template strings start and end with backticks (<code>`</code>). You can put any expression within the templates:

```js
let a = 2;
let myString = `2 plus ${a} is ${2 + a}`;
// -> "2 plus 2 is 4"
```

Template strings can also be multi-line:

```js
let myString = `This is a
multi-line string`;
// -> "This is a\nmulti-line string"
```

### Refactoring recommendation
> Use template strings in most cases where you would normally use string concatenation. Definitely use template strings for multi-line strings. They are particularly useful for inline templates in Angular directives.

## New String methods
The `String` class has a few new useful methods. The most useful ones are:

* `haystack.includes(needle)` - tests if a `haystack` includes `needle`. No more `haystack.indexOf(needle)`!
* `haystack.startsWith(needle)` and `haystack.endsWith(needle)` - self explanatory.
* `'test '.repeat(3)` - returns `'test test test '`.

### Refactoring recommendation
> Definitely use these methods instead of `indexOf()` for checking for substrings. They are much more readable.
