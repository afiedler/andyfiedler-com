---
layout: post
status: publish
published: true
title: How much space does Postgres's new JSONB format save?
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 341
wordpress_url: http://andyfiedler.com/?p=341
date: '2015-09-10 15:42:55 -0400'
date_gmt: '2015-09-10 19:42:55 -0400'
categories:
- Scrapbook
tags:
- postgres
---
Postgres 9.4 has a new column format called "JSONB" that is a binary representation of JSON. The coolest thing about this new column type is that it supports indexes, so you can now query JSON columns much faster. However, a side benefit is that it is also slightly smaller. I recently did a test where I took a 53 MB table of mostly JSON data and converted it to JSONB. Before and after the conversion I did a `VACUUM FULL` on the table. Space savings was about 12.3%.

Just one observation you might want to consider if you are thinking about switching formats.
