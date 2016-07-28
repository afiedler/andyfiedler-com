---
layout: post
status: publish
published: true
title: 'Using NGINX to proxy TileStache '
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 180
wordpress_url: http://andyfiedler.com/?p=180
date: '2012-08-30 12:54:18 -0400'
date_gmt: '2012-08-30 16:54:18 -0400'
categories:
- Tech Notes
tags: []
---
<p>I'm working on a re-rendering of OpenStreetMap for hiking, with hill shading and topographic lines and I decided to use TileStache to render the tiles. TileStache has the nice ability to render tiles from a bunch of different sources and then overlay them with different amounts of transparency and layer masks (just like Photoshop). TileStache is a Python WSGI server that you can run in mod_python or GUnicorn to serve tiles directly over HTTP. TileStache can cache map tiles to the file system and serve the static PNGs if they exist or render them from scratch using Mapnik if they don't. Its pretty fast, especially if the tiles are pre-rendered.</p>
<p>However, GUnicorn is a pre-forking server. This means that it needs to fork a different process for each client connection. What happens if a slow client connects is that TileStache processes are rapidly used up to serve that client (typically clients make up to 8 separate HTTP connections for slippy maps, resulting in 8 processes each!). This is the case even if the tiles are being served from cache.</p>
<p>What you need to do is add a reverse proxy in front of GUnicorn, using something like NGINX. The reverse proxy using an evented IO model, which enables it to manage sending data back to a slow client without using an operating system process. NGINX can also directly serve static assets from the filesystem, which means we can serve the cached tiles without even hitting GUnicorn&#47;TileStache.</p>
<p>Getting this to work requires a bit of NGINX HttpRewriteModule voodoo, though. The issue is that TileStache saves cached tiles in a slightly different path than the URI path that comes in via HTTP. Say you have a OpenStreetMap-style URL like this: <code>myserver.com&#47;tiles&#47;layer&#47;$z&#47;$x&#47;$y.png<&#47;code>. In this URL, <code>$z<&#47;code> is zoom level (usually 1-19), and <code>$x<&#47;code> and <code>$y<&#47;code> are tile coordinates. For higher zoom levels, you can have 10,000+ by 10,0000+ tiles in the x and y directions. That's way too many PNG files to store in one folder on the filesystem. So, TileStache splits up the x and y paths into two levels. Say you have a URL like <code>&#47;tiles&#47;layer&#47;7&#47;12345&#47;67890.png<&#47;code>. TileStache will store that in the filesystem path <code>&#47;tiles&#47;layer&#47;7&#47;012&#47;345&#47;067&#47;890.png<&#47;code>. Notice how 12345 is broken into 012&#47;345? That means that there will be at most 1,000 files or folders in each directory&mdash;a manageable amount. The issue is we need to get NGINX to rewrite URLs to server these static assets. Here's how I accomplished that:</p>
<pre class="lang:default highlight:0 decode:true" title="Main NGINX location directive">	location ~ ^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]+)\&#47;([\d]+)\.png {<br />
		root &#47;osm&#47;cache;</p>
<p>		set $originaluri &#47;$1&#47;$2&#47;$3&#47;$4.png;</p>
<p>		# 1 char X<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{1})\&#47;([\d]{1}).png$" &#47;$1&#47;$2&#47;000&#47;00$3&#47;000&#47;00$4.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{1})\&#47;([\d]{2}).png$" &#47;$1&#47;$2&#47;000&#47;00$3&#47;000&#47;0$4.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{1})\&#47;([\d]{3}).png$" &#47;$1&#47;$2&#47;000&#47;00$3&#47;000&#47;$4.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{1})\&#47;([\d]{1})([\d]{3}).png$" &#47;$1&#47;$2&#47;000&#47;00$3&#47;00$4&#47;$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{1})\&#47;([\d]{2})([\d]{3}).png$" &#47;$1&#47;$2&#47;000&#47;00$3&#47;0$4&#47;$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{1})\&#47;([\d]{3})([\d]{3}).png$" &#47;$1&#47;$2&#47;000&#47;00$3&#47;$4&#47;$5.png break;</p>
<p>		# 2 char X<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{2})\&#47;([\d]{1}).png$" &#47;$1&#47;$2&#47;000&#47;0$3&#47;000&#47;00$4.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{2})\&#47;([\d]{2}).png$" &#47;$1&#47;$2&#47;000&#47;0$3&#47;000&#47;0$4.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{2})\&#47;([\d]{3}).png$" &#47;$1&#47;$2&#47;000&#47;0$3&#47;000&#47;$4.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{2})\&#47;([\d]{1})([\d]{3}).png$" &#47;$1&#47;$2&#47;000&#47;0$3&#47;00$4&#47;$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{2})\&#47;([\d]{2})([\d]{3}).png$" &#47;$1&#47;$2&#47;000&#47;0$3&#47;0$4&#47;$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{2})\&#47;([\d]{3})([\d]{3}).png$" &#47;$1&#47;$2&#47;000&#47;0$3&#47;$4&#47;$5.png break;</p>
<p>		# 3 char X<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{3})\&#47;([\d]{1}).png$" &#47;$1&#47;$2&#47;000&#47;$3&#47;000&#47;00$4.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{3})\&#47;([\d]{2}).png$" &#47;$1&#47;$2&#47;000&#47;$3&#47;000&#47;0$4.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{3})\&#47;([\d]{3}).png$" &#47;$1&#47;$2&#47;000&#47;$3&#47;000&#47;$4.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{3})\&#47;([\d]{1})([\d]{3}).png$" &#47;$1&#47;$2&#47;000&#47;$3&#47;00$4&#47;$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{3})\&#47;([\d]{2})([\d]{3}).png$" &#47;$1&#47;$2&#47;000&#47;$3&#47;0$4&#47;$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{3})\&#47;([\d]{3})([\d]{3}).png$" &#47;$1&#47;$2&#47;000&#47;$3&#47;$4&#47;$5.png break;</p>
<p>		# 4 char X<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{1})([\d]{3})\&#47;([\d]{1}).png$" &#47;$1&#47;$2&#47;00$3&#47;$4&#47;000&#47;00$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{1})([\d]{3})\&#47;([\d]{2}).png$" &#47;$1&#47;$2&#47;00$3&#47;$4&#47;000&#47;0$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{1})([\d]{3})\&#47;([\d]{3}).png$" &#47;$1&#47;$2&#47;00$3&#47;$4&#47;000&#47;$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{1})([\d]{3})\&#47;([\d]{1})([\d]{3}).png$" &#47;$1&#47;$2&#47;00$3&#47;$4&#47;00$5&#47;$6.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{1})([\d]{3})\&#47;([\d]{2})([\d]{3}).png$" &#47;$1&#47;$2&#47;00$3&#47;$4&#47;0$5&#47;$6.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{1})([\d]{3})\&#47;([\d]{3})([\d]{3}).png$" &#47;$1&#47;$2&#47;00$3&#47;$4&#47;$5&#47;$6.png break;</p>
<p>		# 5 char X<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{2})([\d]{3})\&#47;([\d]{1}).png$" &#47;$1&#47;$2&#47;0$3&#47;$4&#47;000&#47;00$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{2})([\d]{3})\&#47;([\d]{2}).png$" &#47;$1&#47;$2&#47;0$3&#47;$4&#47;000&#47;0$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{2})([\d]{3})\&#47;([\d]{3}).png$" &#47;$1&#47;$2&#47;0$3&#47;$4&#47;000&#47;$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{2})([\d]{3})\&#47;([\d]{1})([\d]{3}).png$" &#47;$1&#47;$2&#47;0$3&#47;$4&#47;00$5&#47;$6.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{2})([\d]{3})\&#47;([\d]{2})([\d]{3}).png$" &#47;$1&#47;$2&#47;0$3&#47;$4&#47;0$5&#47;$6.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{2})([\d]{3})\&#47;([\d]{3})([\d]{3}).png$" &#47;$1&#47;$2&#47;0$3&#47;$4&#47;$5&#47;$6.png break;</p>
<p>		# 6 char X<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{3})([\d]{3})\&#47;([\d]{1}).png$" &#47;$1&#47;$2&#47;$3&#47;$4&#47;000&#47;00$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{3})([\d]{3})\&#47;([\d]{2}).png$" &#47;$1&#47;$2&#47;$3&#47;$4&#47;000&#47;0$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{3})([\d]{3})\&#47;([\d]{3}).png$" &#47;$1&#47;$2&#47;$3&#47;$4&#47;000&#47;$5.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{3})([\d]{3})\&#47;([\d]{1})([\d]{3}).png$" &#47;$1&#47;$2&#47;$3&#47;$4&#47;00$5&#47;$6.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{3})([\d]{3})\&#47;([\d]{2})([\d]{3}).png$" &#47;$1&#47;$2&#47;$3&#47;$4&#47;0$5&#47;$6.png break;<br />
		rewrite "^\&#47;tiles\&#47;([\w\-]+)\&#47;([\d]+)\&#47;([\d]{3})([\d]{3})\&#47;([\d]{3})([\d]{3}).png$" &#47;$1&#47;$2&#47;$3&#47;$4&#47;$5&#47;$6.png break;</p>
<p>		# Try to serve the file from the disk. If that doesn't work, pass through the request via the proxy<br />
		try_files $uri @tilestache;<br />
	}<&#47;pre><br />
This mountain of rewrite lines will rewrite the request URL to the filesystem format, then look for tiles in the filesystem tree starting at <code>&#47;osm&#47;cache<&#47;code>. The last line tells NGINX to look for the rewritten URL, then if the file is not found, to send the request to the <code>@tilestache;<&#47;code> location block, which looks like this:</p>
<pre class="lang:default highlight:0 decode:true " title="Proxy NGINX block">	 location @tilestache {</p>
<p>		# Rewrite back to standard OSM form<br />
		rewrite ^(.*)$ $originaluri break;<br />
		add_header X-Static miss;<br />
		proxy_pass http:&#47;&#47;127.0.0.1:8080;<br />
		proxy_set_header Host $http_host;<br />
	}<&#47;pre><br />
That location block proxies the request to the GUnicorn server listening on localhost:8080.</p>
<p>This seems to be working great. NGINX is far faster in serving static assets, and if all of the worker TileStache processes are busy rendering, the cached zoom levels of the map work fine!</p>
