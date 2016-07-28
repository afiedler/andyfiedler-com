---
layout: post
status: publish
published: true
title: Installing WxPython and RunSnakeRun on Mac OSX 10.9
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 273
wordpress_url: http://andyfiedler.com/?p=273
date: '2014-05-28 09:37:42 -0400'
date_gmt: '2014-05-28 13:37:42 -0400'
categories:
- Tech Notes
tags: []
---
I just <a title="The barebones profiling method that is surprisingly effective" href="http://andyfiedler.com/blog/the-barebones-profiling-method-that-is-surprisingly-effective-272/">posted about my Ctrl-C strategy for profiling</a> and now I'm going to completely flip-flop and explain how I installed RunSnakeRun, a way to visualize the output of Python's cProfile. The Ctrl-C way of profiling worked really well for optimizing append performance of my <a title="TsTables Github" href="http://github.com/afiedler/tstables" target="_blank">time series storage library</a>, but doesn't work so great for profiling things that are already very fast (on the order of milliseconds) and need to be faster.

For that, RunSnakeRun worked really well. RunSnakeRun gives you a nice rectangle chart showing in which functions your program spends most of its time.

{% picture wp/uploads/2014/05/Screen-Shot-2014-05-28-at-9.27.01-AM-800x499.png %}

To install RunSnakeRun on Mac OSX, you'll need Homebrew and PIP. You can install it like this:
<pre class="lang:default highlight:0 decode:true crayon-selected" title="Bash commands to install RunSnakeRun">$ brew install wxpython --python --devel
$ pip install SquareMap RunSnakeRun</pre>
Next, you'll need to export a pstats database with your profiler information. Use cProfile to do this. For TsTables, you can run the benchmark with profiling information like this:
<pre class="lang:python decode:true " title="How to run the TsTables benchmark with profiling information">import cProfile
import tstables

cProfile.run('tstables.Benchmark.main()','tstables.profile')</pre>
This will create a tstables.profile file in the current directory, which you can open with RunSnakeRun. Start RunSnakeRun by running <span class="lang:default highlight:0 decode:true  crayon-inline ">runsnake</span>  (assuming that PIP's bin folder is in your path).
