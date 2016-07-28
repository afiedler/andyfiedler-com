---
layout: post
status: publish
published: true
title: Mapbox Studio Creation - OSM Hiking Map
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 311
wordpress_url: http://andyfiedler.com/?p=311
date: '2015-05-13 11:00:49 -0400'
date_gmt: '2015-05-13 15:00:49 -0400'
categories:
- Tech Notes
tags: []
---
I've been experimenting with <a title="Mapbox Studio" href="https://www.mapbox.com/mapbox-studio" target="_blank">Mapbox Studio</a>, which is an awesome way to create maps without the pain of setting up a server or downloading Open Street Map data.

The way Mapbox Studio works is that Mapbox has pre-rendered vector tiles from Open Street Map at all 22 standard zoom levels. Mapbox has also pre-rendered hill shading tiles and contour lines! You just need to style them with CartoCSS, which is as easy as it sounds (if you know CSS).

They have a bunch of great starter styles, one of which is Mapbox Outdoors. I modified that to make it a little better for hiking by adjusting the trail labels and making trails more prominent.

You can get the <a title="Hiking Map CartoCSS" href="https://github.com/afiedler/hiking-map.tm2" target="_blank">CartoCSS for the hiking map here</a> and see a <a title="Hiking Map Demo" href="https://api.tiles.mapbox.com/v4/afiedler.e83d82a2/page.html?access_token=pk.eyJ1IjoiYWZpZWRsZXIiLCJhIjoiN2c5VFFRSSJ9.45nCmyDqG5vpSOuHnCj0qQ#15/38.9863/-77.2362" target="_blank">demo of the hiking map here</a>.

Here's Great Falls, Maryland with my changes.

[caption id="attachment_314" align="aligncenter" width="660"]<a href="http://andyfiedler.com/wp-content/uploads/2015/05/great-falls.png"><img class="size-large wp-image-314" src="http://andyfiedler.com/wp-content/uploads/2015/05/great-falls-733x800.png" alt="Great Falls Hiking Map. Data from Open Street Map and Mapbox." width="660" height="720" /></a> Great Falls Hiking Map. Data from Open Street Map and Mapbox.[/caption]
