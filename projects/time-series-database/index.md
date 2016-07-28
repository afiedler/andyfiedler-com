---
layout: page
status: publish
published: true
title: Time Series Database
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 53
wordpress_url: http://andyfiedler.com/?page_id=53
date: '2012-06-23 11:57:43 -0400'
date_gmt: '2012-06-23 15:57:43 -0400'
categories: []
tags: []
redirect_from:
  - /projects/time-series-database
  - /projects/time-series-database/
---
## Deprecated
This project isn't being maintained any more. Check out my replacement, <a title="TsTables &ndash; Store High Frequency Data with PyTables" href="http:&#47;&#47;andyfiedler.com&#47;projects&#47;tstables-store-high-frequency-data-with-pytables&#47;">TsTables<&#47;a>!</p>
<h2>Overview<&#47;h2><br />
This project was started as a way to organize massive amounts of time series data. We had terabytes of high frequency foreign exchange data and wanted to run models on it in common statistical programming languages like R and MATLAB. However, with that much data, there is no way we could fit it into memory on a normal desktop PC.</p>
<p>Believe it or not, there is no simple, affordable solution to this problem out there. We tried stuffing it into MySQL (epic fail), SAS (couldn't figure out a good way to index it, plus we wanted to use MATLAB and R for analysis), and flat text files (sort of worked, but was clumsy and space-inefficient).</p>
<p>We did, however, find the excellent <a href="http:&#47;&#47;hdfgroup.org">HDF5 library<&#47;a>, which is used by many scientists to store large matrixes. HDF5 seemed like a good solution, but it has no time series indexing. Time Series Database (TSDB), is a wrapper on HDF5 to provide a nice interface for storing time series data as well as a basic sparse B-Tree index on the timestamp. TSDB takes advantage of the fact that most time series data is already sorted and thus you can save a ton of space by inserting an index point every few thousand records and then sequentially searching to find your desired record.</p>
<h2>Features<&#47;h2></p>
<ul>
<li>Fast subsetting. Able to extract a million rows into MATLAB in a few seconds<&#47;li>
<li>Compact file size. It uses a sparse index, so no more multi-gigabyte SAS or relational database indexes. ZLib compression is also enabled by default for further space&nbsp;savings.<&#47;li>
<li>Millisecond precision<&#47;li>
<li>Multiple records with the same timestamp are okay<&#47;li>
<li>Gaps in data are okay. TSDB does not force you to store your data on an equally-spaced grid, like time series databases like <a href="http:&#47;&#47;www.sungard.com&#47;fame">FAME<&#47;a>.<&#47;li>
<li>A bunch of datatypes
<ul>
<li>32-bit integer<&#47;li>
<li>8-bit integer<&#47;li>
<li>64-bit double<&#47;li>
<li>1-byte character<&#47;li>
<li>64-bit timestamp (millisecond precision)<&#47;li>
<li>string (user-specified length)<&#47;li><br />
<&#47;ul><br />
<&#47;li><br />
<&#47;ul></p>
<h2>Limitations<&#47;h2></p>
<ul>
<li>Time series are <strong>append only<&#47;strong>. It's possible with HDF5 to edit or insert data in the middle of table, but we haven't written the code to update the indexes in that case. I probably won't add that feature because this is designed for batch appends of CSV data.<&#47;li>
<li>When appending, you&nbsp;<strong>must<&#47;strong> start appending with a row that has a timestamp equal to or after the last timestamp of the existing table. The library will refuse your append if that's not the case.<&#47;li>
<li>Any data you append must be sorted from earliest timestamp to latest.<&#47;li>
<li>You cannot add or remove a column after a time series is created.<&#47;li>
<li>You cannot delete a time series from a file (you can obviously delete a file, though).<&#47;li>
<li>You cannot have variable length rows. So, if you include a large string field then that number of byte is allocated for each row no matter the length of the string stored in that row. Compression helps with this problem, though, and changing it would slow down the library.<&#47;li>
<li>You can't change the precision of the timestamps (millisecond only).<&#47;li>
<li>You can't store timezone info with the timestamp. The library makes no time zone assumptions, though.<&#47;li>
<li>It does <strong>not<&#47;strong> support transactions, so if your program crashes while you are writing to a time series, you could corrupt the file. Keep backups!<&#47;li>
<li>Its not under active development. But, if there's a glaring bug, I'll try to fix it.<&#47;li><br />
<&#47;ul></p>
<h2>Intended usage<&#47;h2><br />
TSDB is beta software, at best. You should&nbsp;<strong>not<&#47;strong> use it to store your only copy of some critical data. Its best use it to store a copy of your raw data in a format that makes it very easy to extract subsets. The idea is to write your time series model in a way that you pull subsets of your data into memory, do some processing, and then write the result to disc.</p>
<h2>Get the source code<&#47;h2><br />
The source code is hosted on Github. I'm in the process of cleaning up this library, and right now only the C++ library is ready to use. I've only tested the build instructions on a Mac (although Linux should be very similar).</p>
<ul>
<li><a href="https:&#47;&#47;github.com&#47;afiedler&#47;tsdb">Get a copy of the source here<&#47;a>.<&#47;li>
<li><a href="https:&#47;&#47;github.com&#47;afiedler&#47;tsdb&#47;wiki&#47;Build-Instructions-(Mac-OSX)">Build instructions for Mac OS X are here<&#47;a>.<&#47;li><br />
<&#47;ul></p>
<h2><&#47;h2></p>
