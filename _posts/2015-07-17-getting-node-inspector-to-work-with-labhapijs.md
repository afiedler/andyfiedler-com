---
layout: post
status: publish
published: true
title: Getting Node-Inspector to work with Lab&#47;HapiJS
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 325
wordpress_url: http://andyfiedler.com/?p=325
date: '2015-07-17 14:37:41 -0400'
date_gmt: '2015-07-17 18:37:41 -0400'
categories:
- Scrapbook
tags:
- nodejs
---
Debugging specs with console.log statements is a real pain. Node-Inspector is far better, giving you an environment that is basically the same as Chrome DevTools.

To use it with Lab, add this script to your package.json file:

```js
{
  // other package.json stuff
  "scripts": {
    "test-debug": "node-debug ./node_modules/.bin/lab"
  }
}
```

You can now run all of your specs with `npm run test-debug` , or run the specs in just one file with `npm run test-debug <path to your spec file>.js`.
