---
layout: post
status: publish
published: true
title: How to Parse Sketch Files with NodeJS
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 350
wordpress_url: http://andyfiedler.com/?p=350
date: '2015-12-11 15:45:59 -0500'
date_gmt: '2015-12-11 20:45:59 -0500'
categories:
- Tech Notes
tags:
- nodejs
- sketch
---
I've recently been working more with [Sketch](https://www.sketchapp.com/), and wanted to see if I could get Sketch files to render on Linux. Turns out that no one has released open-source software to parse or open Sketch files yet, so I decided to see how hard it would be to parse them with NodeJS.

Here's the results of my efforts: [Github Project](https://github.com/afiedler/sketch-node-parser)

This needs more work to make it usable, but Sketch files aren't too difficult to deal with.
