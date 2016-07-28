---
layout: post
status: publish
published: true
title: Lodash&#47;Underscore on Google App Script
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 305
wordpress_url: http://andyfiedler.com/?p=305
date: '2015-03-12 15:02:25 -0400'
date_gmt: '2015-03-12 19:02:25 -0400'
categories:
- Tech Notes
tags: []
---
I've recently been working on a Google App Script project, and wanted to use Underscore or Lodash because writing Javascript is relatively painful without those libraries. The problem is that Lodash does a lot of feature detection by trying to throw exceptions, and the Google App Script debugger pauses on all exceptions.

The fix is to just modify Lodash slightly to hard-code the Google App Script features that throw exceptions. This isn't too hard to do, but it is a pain, so I've posted my <a title="Lodash modified for Google App Script" href="https://gist.github.com/afiedler/261a20ac4c7e7befc40e" target="_blank">modified version of Lodash as a Gist here</a>.
