---
layout: post
status: publish
published: true
title: Getting Jetbrains DataGrip to work with Heroku Postgres
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 361
wordpress_url: http://andyfiedler.com/?p=361
date: '2016-02-11 11:03:52 -0500'
date_gmt: '2016-02-11 16:03:52 -0500'
categories:
- Tech Notes
tags:
- postgres
- datagrip
redirect_from:
  - /blog/getting-jetbrains-datagrip-to-work-with-heroku-postgres-361/
  - /blog/getting-jetbrains-datagrip-to-work-with-heroku-postgres-361
---
Heroku Postgres forces you to use SSL, but the connection isn't signed with a well-known CA. To get this to work in DataGrip, you have to mess around with some JDBC settings. Here's how to do it:

In the add connections dialog, enter the username, password, hostname, port, and database name. You'll have to enter these manually, because DataGrip's URL support only works with JDBC database URLs, not the more common Postgres URLs used by Heroku.

Next, click on the Advanced tab. Then find the `ssl` property and set it to `true`. Then find the `sslfactory` property and set it to `org.postgresql.ssl.NonValidatingFactory`.

You should be good to go!
