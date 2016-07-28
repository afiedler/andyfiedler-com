---
layout: post
status: publish
published: true
title: Using Node datapipes to ETL from one MongoDB collection to a second MongoDB
  collection
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 321
wordpress_url: http://andyfiedler.com/?p=321
date: '2015-07-15 16:14:01 -0400'
date_gmt: '2015-07-15 20:14:01 -0400'
categories:
- Scrapbook
tags:
- nodejs
- mongodb
- data
---
ETL - not the most fun to write, but the <a href="https://www.npmjs.com/package/datapipes">datapipes</a> package makes it pretty easy on NodeJS.

One thing that wasn't explained in the documentation well was how to ETL from one MongoDB to another using the MongodbMixin. The problem when you use the MongodbMixin twice in the same pipe is that it gets confused about which connection to use for which things. Here's how to use pipe groups to fix that.

```javascript
var etlProcess = datapumps.group();

var extractPump = etlProcess.addPump('extract')
extractPump
  .mixin(MongodbMixin(sourceDbUrl))
  .useCollection(sourceCollection)
  .from(extractPump.find({})); // take all items from sourceCollection

var upsertPump = etlProcess.addPump('upsert');
upsertPump
  .from(extractPump)
  .mixin(MongodbMixin(sinkDbUrl))
  .useCollection(sinkDbCollection)
  .process(function(item) {
    console.log(' - ETLing ' + item['_id']);
    // need to return a promise from process
    return upsertPump.update({ '_id': item['_id'] }, item, {upsert: true});
  });


etlProcess
  .logErrorsToConsole()
  .start()
  .whenFinished().then(function() {
    console.log('finished ETLing.');
    process.exit(0);
  });
```
