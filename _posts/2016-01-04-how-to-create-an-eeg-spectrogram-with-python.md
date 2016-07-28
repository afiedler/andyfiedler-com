---
layout: post
status: publish
published: true
title: How to Create an EEG Spectrogram with Python
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 351
wordpress_url: http://andyfiedler.com/?p=351
date: '2016-01-04 20:47:18 -0500'
date_gmt: '2016-01-05 01:47:18 -0500'
categories:
- Tech Notes
tags:
- eeg
- mindwave
- python
- neuroscience
---
I recently got a [Neurosky Mindwave](http://www.amazon.com/NeuroSky-MindWave-Mobile-BrainWave-Starter/dp/B00B8BF4EM/ref=pd_sim_23_2?ie=UTF8&dpID=41o3rl5m2dL&dpSrc=sims&preST=_AC_UL160_SR160%2C160_&refRID=0VGRK15RHHK9ZTE37448), which measures EEG waves and sends them via Bluetooth to your computer or phone.

Busting out some of my rusty signal processing from college, I made a spectrogram from the EEG. Check it out!

[caption id="attachment_355" align="aligncenter" width="731"]<a href="http://andyfiedler.com/wp-content/uploads/2016/01/eeg.png"><img src="http://andyfiedler.com/wp-content/uploads/2016/01/eeg.png" alt="EEG Spectrogram" width="731" height="281" class="size-full wp-image-355" /></a> EEG Spectrogram from Mindwave Mobile[/caption]

To check out how I made this, see this [IPython notebook](https://gist.github.com/afiedler/6e498d2981ea7b788b61). This is using Jupyter and Python 3, with data recorded using [node-thinkgear-sockets](https://github.com/afiedler/node-thinkgear-sockets).
