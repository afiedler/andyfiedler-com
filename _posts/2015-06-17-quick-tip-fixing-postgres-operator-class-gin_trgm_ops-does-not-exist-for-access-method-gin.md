---
layout: post
status: publish
published: true
title: 'Quick Tip: Fixing Postgres operator class "gin_trgm_ops" does not exist for
  access method "gin"'
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 318
wordpress_url: http://andyfiedler.com/?p=318
date: '2015-06-17 15:33:27 -0400'
date_gmt: '2015-06-17 19:33:27 -0400'
categories:
- Scrapbook
tags:
- postgres
redirect_from:
  - /blog/quick-tip-fixing-postgres-operator-class-gin_trgm_ops-does-not-exist-for-access-method-gin-318/
  - /blog/quick-tip-fixing-postgres-operator-class-gin_trgm_ops-does-not-exist-for-access-method-gin-318  
---
This error can show up when you are trying to load a schema into a new database in Postgres that has been dumped from a database with the pg_trgm extension. You can fix it by adding the extension to the template database (template1) so that when you create a new database, it is already there, ready to go.

To do this, run this at the command line:

```
psql -d template1 -c 'create extension pg_trgm;'
```
