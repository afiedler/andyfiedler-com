---
layout: post
status: publish
published: true
title: Using TSDB to store U.S. Equities data from TickData
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 85
wordpress_url: http://andyfiedler.com/?p=85
date: '2012-07-06 17:18:20 -0400'
date_gmt: '2012-07-06 21:18:20 -0400'
categories:
- Tech Notes
tags: []
---
<p>In this article, I'll show you how to use my&nbsp;<a title="Time Series Database" href="http:&#47;&#47;andyfiedler.com&#47;projects&#47;time-series-database&#47;">Time Series Database<&#47;a> to import some sample U.S. equities data from <a href="http:&#47;&#47;www.tickdata.com">TickData<&#47;a>, a data provider of high-frequency historical financial data. First, get the <a href="http:&#47;&#47;www.tickdata.com&#47;downloads&#47;SampleEquityData_US.zip">sample data<&#47;a> and unzip it on your computer. Look in the Quotes folder for a file called GLP_27667.asc. This is file has quotes for Global Partners LP, a petroleum company. If you are running on Mac OS X or Linux, you can use the <code>head<&#47;code> command to see the first few lines, which in my download look like this:</p>
<pre class="lang:default highlight:0 decode:true">11&#47;01&#47;2011,04:00:00.301,P,14.5,21.36,5,1,R,,175,P,P,1,2,,C<br />
11&#47;01&#47;2011,04:56:38.930,P,14.5,21.36,5,2,R,,18491,P,P,1,2,,C<br />
11&#47;01&#47;2011,06:02:00.115,M,0,0,0,0,R,,40307,M,M,0,2,,C<br />
11&#47;01&#47;2011,07:15:35.501,P,16.67,21.36,15,2,R,,73573,P,P,1,2,,C<br />
11&#47;01&#47;2011,07:28:41.053,P,18.4,21.36,10,2,R,,80351,P,P,1,2,,C<br />
11&#47;01&#47;2011,07:35:03.401,T,15.18,0,1,0,R,,88691,T,T,0,2,,C<br />
11&#47;01&#47;2011,07:35:03.402,T,15.18,25.1,1,1,R,,88692,T,T,0,2,,C<br />
11&#47;01&#47;2011,07:50:24.960,T,15.18,21.22,1,1,R,,100945,T,T,6,2,,C<br />
11&#47;01&#47;2011,07:50:29.064,P,14.5,21.36,5,2,R,,100980,P,P,6,2,,C<br />
11&#47;01&#47;2011,07:50:29.072,T,0,21.22,0,1,R,,100981,T,T,6,2,,C<&#47;pre><br />
If you look on TickData's website, you can find a <a title="U.S. Equities TickData Format Definition" href="http:&#47;&#47;www.tickdata.com&#47;pdf&#47;TickData_File_Format_Overview_US_Equities.pdf">document describing the format<&#47;a> of these files in detail, but for this example, we're only going to look at the first 7 fields.</p>
<ul>
<li>Date (MM&#47;DD&#47;YYYY)<&#47;li>
<li>Time<&#47;li>
<li>Exchange indicator (P means ARCA, M means Chicago, T means NASD)<&#47;li>
<li>Bid Price<&#47;li>
<li>Ask Price<&#47;li>
<li>Bid Amount (100 share lots)<&#47;li>
<li>Ask Amount (100 share lots)<&#47;li><br />
<&#47;ul><br />
Let's create a new TSDB file to store this data. To do this, use the tsdbcreate command.</p>
<pre class="lang:sh decode:true">tsdbcreate glp.tsdb quotes char exchange double bid_price double ask_price int32 bid_size int32 ask_size<&#47;pre><br />
This command is creating a new tsdb database called glp.tsdb with a series called "quotes". That series has 5 columns: exchange (a character), bid_price (floating point double), ask_price (floating point double), bid_size and ask_size (both 32-bit integers).</p>
<p>You can add more than one series to a TSDB file. If you were to call the tsdbcreate command and glp.tsdb already existed, then it would add another series to the file.</p>
<p>Now that you have an empty TSDB file, we'll create some import instructions and import the data. TSDB has a program called TSDB import that uses an XML file to describe how to parse the delimited data in a file like a CSV file and append it to the end of a time series.&nbsp; Whenever you import data, you are always appending it to the end of a time series.<strong>&nbsp;<&#47;strong>You can import from more than one file into one series in a TSDB file, but you need to start with the earliest file. You also must make sure each of the files you import are in chronological order from oldest timestamp to newest (repeated timestamps are okay).</p>
<p>Here's an example XML file that shows how you could import the TickData quotes files.</p>
<pre class="lang:xml"><?xml version="1.0" encoding="UTF-8" ?><br />
   <dataimport><br />
      <delimparser field_delim=","><br />
         <fieldparser name="_TDSB_timestamp" type="timestamp"<br />
            tokens="0,1" format_string="%m&#47;%d&#47;%Y %H:%M:%S%F" &#47;><br />
         <fieldparser name="exchange" type="char" tokens="2" &#47;><br />
         <fieldparser name="bid_price" type="double" tokens="3" &#47;><br />
         <fieldparser name="ask_price" type="double" tokens="4" &#47;><br />
         <fieldparser name="bid_amount" type="int32" tokens="5" &#47;><br />
         <fieldparser name="ask_amount" type="int32" tokens="6" &#47;><br />
      <&#47;delimparser><br />
   <&#47;dataimport><&#47;pre><br />
The XML import tells the tsdbimport command how to map the comma-separated values in each line into columns in the database. Notice in the timestamp <code>fieldparser<&#47;code> block, we specify to use tokens 0 and 1 to make the timestamp. This tells the parser to join tokens zero and one with a space and then to parse the combined string as a timestamp.</p>
<p>You can save that XML as a text file called "instructions.xml" and then import the&nbsp;GLP_27667.asc file like this:</p>
<pre class="lang:sh">tsdbimport instructions.xml GLP_27667.asc glp.tsdb quotes<&#47;pre><br />
After you run this command, you'll have the complete GLP time series imported. Now, you can access this data quickly via either the R or MATLAB TSDB bindings. Stay tuned for a article on how to do that within the next few days.</p>
