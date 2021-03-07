---
layout: post
status: publish
published: true
title: Fixing SyntaxHighlighter Evolved Font Size
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 331
wordpress_url: http://andyfiedler.com/?p=331
date: '2015-07-22 11:18:40 -0400'
date_gmt: '2015-07-22 15:18:40 -0400'
categories:
- Scrapbook
tags:
- wordpress
---
[SyntaxHighlighter Evolved](https://wordpress.org/plugins/syntaxhighlighter/) is currently the plugin I use for syntax highlighting on this site. It uses the default text size for code blocks, which doesn't look great since code is in a fixed-width font. To fix that, add a class to the code blocks called `code-blk` in **Settings > SyntaxHighlighter**. Then modify your theme's CSS (or use the Wordpress Jetpack Custom CSS feature) to add CSS like this:

```css
.code-blk {
   font-size: 10pt !important;
}
```

Thanks to [this post](http://matthewturland.com/2012/02/13/wordpress-syntaxhighlighter-font-size-fix/) for the inspiration.
