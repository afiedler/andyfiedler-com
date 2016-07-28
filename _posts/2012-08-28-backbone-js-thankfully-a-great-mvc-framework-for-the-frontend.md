---
layout: post
status: publish
published: true
title: 'Backbone.js: Thankfully, a great MVC framework for the frontend'
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 168
wordpress_url: http://andyfiedler.com/?p=168
date: '2012-08-28 17:45:00 -0400'
date_gmt: '2012-08-28 21:45:00 -0400'
categories:
- Web Development
tags: []
---
<h2>Frameworks, frameworks...<&#47;h2><br />
On the backend, web development frameworks have been growing quickly in popularity. Rails, Django, CakePHP, and others are popular because they save developers a ton of time. Someone once said that a good developer is a lazy developer, and frameworks enable developers to kick back with a Corona on a beach (well, not quite, but close) by making a lot of the architectural decisions for the developer. Rails is a great example of this, with a clear MVC structure, preset file system&nbsp;hierarchy, and even database schema conventions. If you were coding a site in pure Ruby, you'd need to make all of these decision yourself.</p>
<p>While backend frameworks are really popular, there has been a dearth of good choices in front end frameworks. As web apps are moving more processing to client-side Javascript, this was becoming a growing problem.</p>
<h2>The front-end Javascript jungle<&#47;h2><br />
Front-end javascript tends to be a huge mess of jQuery callbacks, DOM elements stuffed with extra object properties, and a polluted root <code>window<&#47;code> object. As client-side applications are get larger, this is completely unsustainable. It makes code hard to maintain, hard to understand, and un-testable with unit testing libraries. Backbone.js greatly helps with all of these issues.</p>
<h2>Enter Backbone.js<&#47;h2><br />
Backbone is a minimalist MVC framework for Javascript. It adds models and collections with persistance code that works well with JSON REST APIs, as well as views that automatically re-render on model updates and controllers that handle hash-bang URLs or HTML5 <code>pushState<&#47;code>.</p>
<p>All of this comes in 4KB of minified Javascript that ties in with jQuery, Underscore, or any other Javascript library.</p>
<h2>Backbone dos and don'ts<&#47;h2><br />
I'm currently working on a small side project to brush up on some Javascript coding, and decided to use Backbone as a front-end framework (I'm using Rails on the backend). Here's some brief notes from a my first impressions:</p>
<p><strong>Do<&#47;strong></p>
<ul>
<li>Put most of your front-end application (or business) logic in the models. This is basically the same thing you would do with a MVC app on the server.<&#47;li>
<li>Use a templating library. Underscore.js has a pretty decent <code>_.template()<&#47;code> function. HTML in really clutters your Javascript code.<&#47;li>
<li>Try using the Rails asset pipeline or some other way to minify and compile your JS. This way, you can spread your Backbone code out into many files. I tended to use a folder&nbsp;hierarchy&nbsp;similar to Rails (folders for models, collections, controllers, and views).<&#47;li><br />
<&#47;ul><br />
<strong>Don't<&#47;strong></p>
<ul>
<li>Put much logic in your views. It is&nbsp;<em>very<&#47;em>&nbsp;hard to debug view code because the function that renders the view is typically created&nbsp;programmatically&nbsp;by the templating library.<&#47;li>
<li>Don't prematurely optimize your view code. The easiest way to render a view is to just create an HTML fragment from a templating library then insert it into the DOM with jQuery. This is fine for most cases. You can also manipulate the DOM by changing the inner text of elements on a view re-render, which might be faster but often isn't worth the extra work.<&#47;li><br />
<&#47;ul></p>
