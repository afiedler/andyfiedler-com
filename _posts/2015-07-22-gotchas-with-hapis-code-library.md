---
layout: post
status: publish
published: true
title: Gotchas with Hapi's Code Library
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 327
wordpress_url: http://andyfiedler.com/?p=327
date: '2015-07-22 10:06:32 -0400'
date_gmt: '2015-07-22 14:06:32 -0400'
categories:
- Scrapbook
tags:
- nodejs
- hapi
---
Overall, I've had a good experience with HapiJS and Code, Hapi's assertion library. There was one gotcha with Code's `deep.equal` function. If you are comparing two objects that have identical non-function properties, but different function properties, `deep.equal` will fail. So, for example, if you compare a Hapi response to a Plain Old Javascript Object fixture, you will get an exception.

The solution is to strip the non-function properties before comparing:

```javascript
// response - an object with some function properties
// fixture - a Plain Old Javascript Object
var responsePojo = JSON.parse(JSON.stringify(response));

expect(responsePojo).to.deep.equal(fixture);
```
