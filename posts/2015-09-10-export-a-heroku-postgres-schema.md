---
layout: post
status: publish
published: true
title: Export a Heroku Postgres Schema
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 342
wordpress_url: http://andyfiedler.com/?p=342
date: '2015-09-10 13:58:45 -0400'
date_gmt: '2015-09-10 17:58:45 -0400'
categories:
- Scrapbook
tags:
- postgres
- heroku
---
This is a quick script to export just the schema from a Heroku Postgres database. It exports the schema with no ownership information, so you can easily load it into a local database.

```ruby
#!/usr/bin/env ruby
require 'uri'
db = URI(`heroku config:get DATABASE_URL`)
system("export PGPASSWORD=#{db.password}; " +
       "pg_dump --schema-only -h #{db.host} -p #{db.port} " +
       "-U #{db.user} -d #{db.path.gsub('/','')} --no-owner -f schema.sql")
```

Make sure you run this script from a folder within your app (with the Heroku git remote correctly set up). It will put the schema in schema.sql in the current working directory.
