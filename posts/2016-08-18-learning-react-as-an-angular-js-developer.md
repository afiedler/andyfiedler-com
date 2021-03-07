---
layout: post
title: Learning React as an AngularJS Developer
---

## React isn't a framework

You use Angular, so you probably like frameworks. React and redux are *not* frameworks in the same sense as Angular. You can use [React Redux Starter Kit](https://github.com/davezuko/react-redux-starter-kit) and/or [Redux CLI](https://github.com/SpencerCDixon/redux-cli) to get a React/Redux app set up with some sensible defaults, though.

### Replacements for other parts of Angular
* `$http` -- [axios](https://github.com/mzabriskie/axios)
* Factories and services -- ES6 modules with Webpack
* Mocking modules (or in Angular, services or factories) in your tests -- [babel-plugin-rewire](https://github.com/speedskater/babel-plugin-rewire)

## Understand the component lifecycle methods

Best resource I've found is [Understanding the React Component Lifecycle](http://busypeoples.github.io/post/react-component-lifecycle/)

## Get a good authentication library

I recommend [redux-auth-wrapper](redux-auth-wrapper).
