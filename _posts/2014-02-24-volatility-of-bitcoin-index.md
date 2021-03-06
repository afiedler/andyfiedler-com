---
layout: post
status: publish
published: true
title: Volatility of Bitcoin Index
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 255
wordpress_url: http://andyfiedler.com/?p=255
date: '2014-02-24 15:31:32 -0500'
date_gmt: '2014-02-24 20:31:32 -0500'
categories:
- Uncategorized
tags: []
---
A while back when I was a research assistant at the Federal Reserve, I worked on a project to make exchange rate volatility indexes for the major world currencies. We basically had some high frequency data for USD/EUR, USD/CHF, and USD/JPY and wanted to see how the financial crisis affected volatility. With all of the hype and turmoil around Bitcoin, I though it would be interesting to make a similar index for the Bitcoin/USD exchange rate.

Before Bitcoin is ever able to become a viable “currency”, volatility needs to come down a lot. Low volatility isn’t sufficient for it to take off, but is probably is necessary. If you take the traditional definition of a currency as a “store of value”, a “medium of exchange”, and a “unit of account”, persistently high volatility is absolutely a death knell. This is especially true in Bitcoin’s case where there is no government backing and there are attractive substitutes in traditional currencies.

One of the cool things about Bitcoin, however, is that lots of the data is fairly open. Most of the rest of the financial market data in the U.S. is behind the copyright lock and seal of the major exchanges and electronic trading networks. Both the NYSE and NASDAQ make lots of money off of selling market data, and they recently won <a title="SEC court case on market data fees" href="http://www.reuters.com/article/2013/04/30/us-sec-exchanges-netcoalition-idUSBRE93T0Q220130430">a court case to raise their rates even further</a>. That makes doing this kind of analysis on other securities an expensive endeavor for armchair quarterbacks like myself!

Bitcoin, however, has a rather open ethos and most of the exchanges publish realtime or near-realtime price data for free. CoinDesk aggregates this into their <a title="Bitcoin Price Index" href="http://www.coindesk.com/price/">Bitcoin Price Index</a>, which they graciously agreed to send over for this analysis.

The Volatility of Bitcoin Index (VOB Index—I’m open to suggestions on the name) is a simple rolling standard deviation of minutely log-returns. That is not nearly as complicated as it sounds. To create the index, I started with a time series of minutely Bitcoin price data and calculated the <a title="Wikipedia - Log Returns" href="http://en.wikipedia.org/wiki/Rate_of_return#Comparing_ordinary_return_with_logarithmic_return">log returns</a> (basically percent increase or decrease for each minute).  Then for each period, I took all of the returns within a trailing window and computed the standard deviation. I did this for three window lengths: 30, 60 and 90 days, and then annualized it. The Bitcoin markets are 24/7/365, so there are no holiday or weekend adjustments, which makes things a bit easier.

Here’s what the index looks like for the period August 2011 to January 31, 2014.

<img class="aligncenter size-full wp-image-256" alt="Volatility of Bitcoin Index" src="http://andyfiedler.com/wp-content/uploads/2014/02/vob_plot.png" width="800" height="462" />Here’s the BPI (Bitcoin Price Index) over that period.

<img class="aligncenter size-full wp-image-257" alt="BPI Index" src="http://andyfiedler.com/wp-content/uploads/2014/02/bpi_plot.png" width="800" height="462" />
Bitcoin volatility looks like it is dropping over time, especially from the early days in 2011 and 2012, except for a large bump in volatility in April of 2013. That was probably sparked by problems at Bitcoin’s largest exchange, Mt. Gox during that time period. This decrease is despite an increase in speculative interest in Bitcoin and moves by China to curtail the currency’s use.

Whether Bitcoin takes off is anyone’s guess and predicting if it does is probably a fool’s errand. There are lots of smart people working on it, but big questions about its viability still remain. In either case, it should be exciting to watch!
