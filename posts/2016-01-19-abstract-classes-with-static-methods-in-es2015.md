---
layout: post
status: publish
published: true
title: Abstract Classes with Static Methods in ES2015
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 357
wordpress_url: http://andyfiedler.com/?p=357
date: '2016-01-19 14:42:17 -0500'
date_gmt: '2016-01-19 19:42:17 -0500'
categories:
- Tech Notes
tags:
- nodejs
- es2015
---
ES2105 classes have much better support for static method patterns than traditional ways of doing it in ES5.

In ES2015, there are actually two prototype chains in classes: one for instance methods and one for static methods. This means you can use `super` and `this` in a static method, and it works as expected.

This makes using an abstract class pattern much easier. Here's an example:

```js
'use strict';

class AbstractShape {
  static get SHAPE_NAME() {
    throw new Error(
      'must specify a SHAPE_NAME in your subclass of ' +
      'AbstractShape'
    );
  }

  static get englishName() {
    return this.SHAPE_NAME['en-US'];
  }

  static get spanishName() {
    return this.SHAPE_NAME['en-MX'];
  }
}

class Square extends AbstractShape {
  static get SHAPE_NAME() {
    return {
      'en-US': 'square',
      'es-MX': 'cuadrado'
    }
  }
}

console.log(Square.englishName); // -> 'square'
console.log(Square.spanishName); // -> 'cuadrado'
console.log(AbstractShape.englishName); // Throws an Error
```

A few things that are interesting with ES2015 static methods:

* You can't have static properties, but you can make static getters to get the same effect (with some syntactic noise).
* In a static method, `this` refers to the class itself. Effectively, you can just access other static methods with `this`.
* You cannot refer to the class itself in the class body. This is not legal:

```js
static get englishName() { return AbstractShape.SHAPE_NAME['en-US']; }
```
I'm guessing is the reason for this is that classes are not hoisted in ES2015.

More class posts coming soon!
