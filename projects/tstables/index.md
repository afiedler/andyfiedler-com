---
layout: page
status: publish
published: true
title: TsTables
subtitle: Store High Frequency Time Series Data with PyTables
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 277
wordpress_url: http://andyfiedler.com/?page_id=277
date: '2014-06-30 10:36:13 -0400'
date_gmt: '2014-06-30 14:36:13 -0400'
categories: []
tags: []
---
TsTables is a simple extension to the [PyTables library](http://pytables.github.io/) that helps with storing large volumes of high frequency time series data in the [HDF5](http://www.hdfgroup.org/) format.

## Example usage

This example reads in minutely bitcoin price data and then fetches a range of that data into a Pandas DataFrame.

```python
# Class to use as the table description
class BpiValues(tables.IsDescription):
    timestamp = tables.Int64Col(pos=0)
    bpi = tables.Float64Col(pos=1)

# Use pandas to read in the CSV data
bpi = pandas.read_csv('bpi_2014_01.csv',index_col=0,names=['date','bpi'],parse_dates=True)

f = tables.open_file('bpi.h5','a')

# Create a new time series
ts = f.create_ts('/','BPI',BpiValues)

# Append the BPI data
ts.append(bpi)

# Read in some data
read_start_dt = datetime(2014,1,4,12,00)
read_end_dt = datetime(2014,1,4,14,30)

rows = ts.read_range(read_start_dt,read_end_dt)

# `rows` will be a pandas DataFrame with a DatetimeIndex.
```

## Use Cases

TsTables is being used to store hundreds of gigabytes of FX trading data for analysis and research. TsTables is designed for an append-once, read-lots workflow. It automatically partitions new time series data into daily tables when appending to a series, greatly speeding up lookup times over a "one big table" approach. TsTables also contains a function to query across date boundaries and join the result into one Pandas DataFrame for easier analysis.

This project was designed as a replacement to a C/C++ library I wrote while I was a Research Assistant at the Federal Reserve Board called [TSDB](/projects/time-series-database). Since I finished that project, time series tooling in Python has improved a lot and dealing with recompiling a C/C++ library was becoming onerous. This project aims to solve the same problem as TSDB—storing lots of time series data in a simple flat file for easy querying—in a much more maintainable and accessible way.

<h2>Benchmarks</h2>

The main goal of TsTables is to make it very fast to read a subset of data, given a time range. Using a simple time series with one year of secondly data with two columns (timestamp and a 32-bit integer price), TsTables has this performance on my 2013 MacBook Pro with a SSD:

 * Time to append one month of data (2.67 million rows): **0.771 seconds**
 * Time to fetch a random one hour subset into memory: **0.305 seconds**
 * File size (32 million rows, uncompressed): **391.6 MB**


## Installing
TsTables requires Python 3, Pandas and PyTables (which requires HDF5). It is available from PyPI.

```
$ pip3 install tstables
```

You can also view and download the code on <a title="TsTables Github" href="https://github.com/afiedler/tstables" target="_blank">Github</a>.
