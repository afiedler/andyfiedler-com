---
layout: post
status: publish
published: true
title: The Ultimate Guide to Dealing with High Frequency Data
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 267
wordpress_url: http://andyfiedler.com/?p=267
date: '2014-05-07 09:10:24 -0400'
date_gmt: '2014-05-07 13:10:24 -0400'
categories:
- Tech Notes
tags:
- time series
- big data
---
I have no idea if this is actually the ultimate guide to high frequency data, but hopefully it is at least a useful guide!

I'm currently working on a project to replace the <a title="Time Series Database" href="http://andyfiedler.com/projects/time-series-database/">Time Series Database</a> (TSDB) that I wrote a few years ago. By re-writing it, I'm learning a lot about what works and what doesn't when dealing with high frequency data. High frequency in this case means billions of records, with timestamp precision down to the millisecond. This data is being used for economic research and analytics, not live trading. It is a pain to deal with because it is simply too large to fit in memory or process with a standard relational database. These are some rules that I've developed while working on this project.
<h2>Partition your data!</h2>
The biggest issue with this much time series data is that you simply cannot index the timestamp column with any normal indexing scheme. In DB-speak, the timestamp column will be a <a title="Cardinality (Wikipedia)" href="http://en.wikipedia.org/wiki/Cardinality_(SQL_statements)" target="_blank">"high cardinality"</a> column, which means it does not lend itself well to indexing. This is a problem because most queries on this kind of high frequency data are to fetch a subset by timestamp, and you do NOT want to make a table scan of a billion plus records to find a few minutes of data.

TSDB attempts to fix this problem by keeping rows in order and creating a <a title="Dense versus Sparse Indexes" href="http://www.cs.sfu.ca/CourseCentral/354/zaiane/material/notes/Chapter11/node5.html" target="_blank">sparse index</a> (an index on every 20,000 rows). This should work in theory, but you must ensure that your rows are always sequential. That makes inserting or updating difficult, because you potentially need to shift rows to maintain the order. Also, I'm not aware of a relational database that lets you create a sparse index, which rules out the most common and best understood data stores.

Another approach is to <em>partition</em> your data. This is my current approach. The way this works is you simply create multiple tables for set time periods (one table per day or month is a good starting point). You then put records that match those time periods in their respective tables and write some logic to union queries across tables.

Partitioning enables the database to hunt through a subset of rows to find the ones that match your query. Both Postgres and MySQL support partitioning, making them viable options for storing time series data. The library that I'm working on will use <a title="PyTables" href="http://pytables.github.io" target="_blank">PyTables</a> to partition time series data by date.
<h2>Store timestamps in UTC</h2>
Most of the time, your source data will have timestamps in UTC. If it doesn't, I suggest you convert to UTC before storing. Most libraries use either UTC or local time internally, and because you can never be sure what time zone your users will be in, using UTC is the least common denominator.

UTC also has the nice property of not having daylight saving time changes. DST causes all sorts of pain when working with 24/7 data. Avoid it by just dealing in UTC internally, and then converting to other timezones for querying or display.
<h2>Store timestamps as integers, even if your programming language uses floats</h2>
MATLAB, Excel, and R all store timestamps internally as floats by default. This gives their timestamp types a large range and high precision, but I don't think it is appropriate for archiving time series data. Why? Floats are imprecise. You do not know with any accuracy the number of significant digits when using a float, and you cannot make comparisons without worrying about round off errors. Admittedly, even with microsecond data, these systems that use a 64-bit double and 1970-01-01 as the epoch will not loose precision until <span style="color: #000000;">2242-03-16, but why worry about it? I recommend a 64-bit integer as the timestamp column. With one tick equaling one millisecond, you have a time range of <span style="color: #252525;">±</span><span style="color: #252525;">292 million years. This is Java's internal representation. With one tick equaling 100 nanoseconds (0.1 microsecond), you have a time range of ±29,227 years, which is what Win32 does. Should be plenty!</span></span>
<h2>Have a solid ETL procedure</h2>
ETL means "extract, transform, load" and is the term for taking data out of one format or system and loading it into another. The step to make sure is solid when you are dealing with high frequency data is the "load" step. Try to make a process where you can revert a botched load automatically. If you don't do this, guaranteed someone or something will screw up an import, and you will be left wading through millions of rows of data to fix it or re-importing everything from your source system.

The most basic way to make the load step revertible is to just make a copy of your time series before writing anything to it. You could devise a more sophisticated process, like using rsync to make diffs of your time series, but be nice to your future self and make backups at the very least!
