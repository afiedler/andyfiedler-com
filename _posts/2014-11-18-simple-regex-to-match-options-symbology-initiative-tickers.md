---
layout: post
status: publish
published: true
title: Simple Regex to Match Options Symbology Initiative Tickers
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 286
wordpress_url: http://andyfiedler.com/?p=286
date: '2014-11-18 11:40:04 -0500'
date_gmt: '2014-11-18 16:40:04 -0500'
categories:
- Tech Notes
tags: []
---
This is a simple regular expression to match Options Symbology Initiative (OSI) tickers. It has been tested in C#:

```c#
var ticker = "AAPL  131101C00470000";
var OSITicker = new Regex(@"(.{6})(\d{2})(0\d|1[0-2])(0[1-9]|[12]\d|3[01])(C|P)(\d{8})");

var match = OSITicker.Match(ticker);
var underlying = match.Groups[1].ToString().Trim();
var expirationDate = new DateTime(
     Int32.Parse(match.Groups[2].ToString()) + 2000,
     Int32.Parse(match.Groups[3].ToString()),
     Int32.Parse(match.Groups[4].ToString()));
var isPut = (match.Groups[5].ToString() == "P");
var strikePrice = Double.Parse(match.Groups[6].ToString()) / 1000;
```
