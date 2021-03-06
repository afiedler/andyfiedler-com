---
layout: post
status: publish
published: true
title: The barebones profiling method that is surprisingly effective
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 272
wordpress_url: http://andyfiedler.com/?p=272
date: '2014-05-27 08:01:06 -0400'
date_gmt: '2014-05-27 12:01:06 -0400'
categories:
- Tech Notes
tags: []
---
I'm working on profiling my time series database (<a title="TsTables" href="http://github.com/afiedler/tstables" target="_blank">TsTables</a>) because append performance is not what I want it to be. I know that the issue is a few loops that are written in Python instead of using NumPy's optimized vector operations. I'm not exactly sure which loop is the slowest.

I started trying to get cProfile to work, but ended up with way too much data to be useful. So I reverted to my old school, barebones profiling method: Ctrl-C.

How do you use this method you might ask? Start your program and randomly hit Ctrl-C. Wherever your program stops most frequently is the probably the slowest part. Speed that up and repeat!
