---
layout: post
status: publish
published: true
title: Testing Angular $q Promises
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 372
wordpress_url: http://andyfiedler.com/?p=372
date: '2016-04-12 10:27:44 -0400'
date_gmt: '2016-04-12 14:27:44 -0400'
categories:
- tech-notes
tags:
- angularjs
---
This is a quick reference to testing Angular's `$q` promises.

<table>
   <caption>Values of <code>promise.$$state.status</code></caption>
   <thead>
      <tr>
         <th>Value</th>
         <th>State</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>0</code></td>
         <td>Outstanding</td>
      </tr>
      <tr>
         <td><code>1</code></td>
         <td>Resolved</td>
      </tr>
      <tr>
         <td><code>2</code></td>
         <td>Rejected</td>
      </tr>
   </tbody>
</table>
