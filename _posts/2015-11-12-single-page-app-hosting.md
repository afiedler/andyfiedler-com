---
layout: post
status: publish
published: true
title: Where Should I Host My Single Page App?
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 345
wordpress_url: http://andyfiedler.com/?p=345
date: '2015-11-12 10:45:44 -0500'
date_gmt: '2015-11-12 15:45:44 -0500'
categories:
- Tech Notes
tags:
- devops
- single page apps
- hosting
redirect_from:
  - /blog/single-page-app-hosting-345/
  - /blog/single-page-app-hosting-345
---
If you are working on an MVP web app these days, chances are you are using a single page app (SPA) framework like Angular, React, or EmberJS. These frameworks are great for a lot of reasons, one being that you can typically host the front-end with just a static file webserver like NGINX or Apache.

Maintaining a webserver is still probably not the best use of your time when you are trying to get your MVP out the door, and hosting a SPA is a little more complex than just a static HTML site. There are a lot of shortcuts out there (such as using Amazon S3) and a few hosted platforms are emerging. Read on to see a comparison of the current solutions, and leave a comment if you know of any others!

<style>
<!--
  #hosts td,th {
    font-size: 10pt;
  }
  #hosts th {
    background-color: #555;
    color: #efefef;
  }
  #hosts th a {
    color: #efefef;
    border-bottom: 1px solid #efefef;
  }
  #hosts tr td:first-child {
    background-color: #ddd;
  }
  #hosts td.pain-low {
    background-color: #D9EAD3;
  }
  #hosts td.pain-medium {
    background-color: #FFE599;
  }
  #hosts td.pain-high {
    background-color: #F9CB9C;
  }
  #hosts td.pain-extreme {
    background-color: #EA9999;
  }
-->
</style>
<table id="hosts">
  <colgroup>
    <col span="1" style="width: 40%;">
    <col span="1" style="width: 60%;">
  </colgroup>
  <tbody>
    <!-- ### Amazon S3 + Cloudfront -->
    <tr>
      <th colspan="2">Amazon S3 + Cloudfront</th>
    </tr>
    <tr>
      <td>Ease of deployment</td>
      <td class="pain-medium">Can be made to work well with <a href="https://github.com/jpillora/grunt-aws" target="_blank">grunt</a>/<a href="https://www.npmjs.com/package/gulp-awspublish" target="_blank">gulp</a> plugins</td>
    </tr>
    <tr>
      <td>Avoids writing or maintaining a webserver</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>Serves files using a CDN</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>SSL on your own domain</td>
      <td class="pain-low"><a href="https://aws.amazon.com/cloudfront/custom-ssl-domains/" target="_blank">Yes</a></td>
    </tr>
    <tr>
      <td>Supports pre-rendering for bots</td>
      <td class="pain-extreme">No</td>
    </tr>
    <tr>
      <td>HTML5 pushState support</td>
      <td class="pain-low"><a href="http://blog.boushley.net/2015/10/29/html5-deep-link-on-amazon-s3/" target="_blank">Sorta, by making index.html the default 404 error page</a></td>
    </tr>
    <tr>
      <td>Proxies backend to avoid CORS issues</td>
      <td class="pain-extreme">No</td>
    </tr>
    <tr>
      <td>Price for a basic, production site</td>
      <td>Depends on traffic, but very cheap</td>
    </tr>
    <!-- ### Amazon S3 + MaxCDN -->
    <tr>
      <th colspan="2">Amazon S3 + <a href="https://www.maxcdn.com/" target="_blank">MaxCDN</a></th>
    </tr>
    <tr>
      <td>Ease of deployment</td>
      <td class="pain-medium">Can be made to work well with grunt/gulp plugins</td>
    </tr>
    <tr>
      <td>Avoids writing or maintaining a webserver</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>Serves files using a CDN</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>SSL on your own domain</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>Supports pre-rendering for bots</td>
      <td class="pain-high">Not really. Possible to make Googlebot work with EdgeRules.</td>
    </tr>
    <tr>
      <td>HTML5 pushState support</td>
      <td class="pain-low">Yes, and can fix 404 issue with <a href="https://www.maxcdn.com/features/rules/" target="_blank">EdgeRules</a>.</td>
    </tr>
    <tr>
      <td>Proxies backend to avoid CORS issues</td>
      <td class="pain-extreme">No</td>
    </tr>
    <tr>
      <td>Price for a basic, production site</td>
      <td>$15/month + S3 charges (minimal). Call for EdgeRules pricing.</td>
    </tr>
    <!-- ### Firebase Hosting -->
    <tr>
      <th colspan="2"><a href="https://www.firebase.com/hosting.html" target="_blank">Firebase Hosting</a></th>
    </tr>
    <tr>
      <td>Ease of deployment</td>
      <td class="pain-low">Has it's own deployment tools that support immutable deploys and rollbacks</td>
    </tr>
    <tr>
      <td>Avoids writing or maintaining a webserver</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>Serves files using a CDN</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>SSL on your own domain</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>Supports pre-rendering for bots</td>
      <td class="pain-extreme">No</td>
    </tr>
    <tr>
      <td>HTML5 pushState support</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>Proxies backend to avoid CORS issues</td>
      <td class="pain-extreme">No</td>
    </tr>
    <tr>
      <td>Price for a basic, production site</td>
      <td>$5/month</td>
    </tr>
    <!-- ### Aerobatic -->
    <tr>
      <th colspan="2"><a href="http://www.aerobatic.com/" target="_blank">Aerobatic</a></th>
    </tr>
    <tr>
      <td>Ease of deployment</td>
      <td class="pain-low">Easy, git-push deploy using Bitbucket</td>
    </tr>
    <tr>
      <td>Avoids writing or maintaining a webserver</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>Serves files using a CDN</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>SSL on your own domain</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>Supports pre-rendering for bots</td>
      <td class="pain-extreme">No</td>
    </tr>
    <tr>
      <td>HTML5 pushState support</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>Proxies backend to avoid CORS issues</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>Price for a basic, production site</td>
      <td>$10/month for 5 sites</td>
    </tr>
    <!-- ### Custom Server on Heroku -->
    <tr>
      <th colspan="2">Custom Server on Heroku</th>
    </tr>
    <tr>
      <td>Ease of deployment</td>
      <td class="pain-low">Easy, git-push deploy</td>
    </tr>
    <tr>
      <td>Avoids writing or maintaining a webserver</td>
      <td class="pain-extreme">No</td>
    </tr>
    <tr>
      <td>Serves files using a CDN</td>
      <td class="pain-extreme">No</td>
    </tr>
    <tr>
      <td>SSL on your own domain</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>Supports pre-rendering for bots</td>
      <td class="pain-medium">Possible</td>
    </tr>
    <tr>
      <td>HTML5 pushState support</td>
      <td class="pain-medium">Possible</td>
    </tr>
    <tr>
      <td>Proxies backend to avoid CORS issues</td>
      <td class="pain-medium">Possible</td>
    </tr>
    <tr>
      <td>Price for a basic, production site</td>
      <td>$25/month + $20/month for SSL</td>
    </tr>
    <!-- ### Custom Server on Heroku + CloudFront -->
    <tr>
      <th colspan="2">Custom Server on Heroku + CloudFront</th>
    </tr>
    <tr>
      <td>Ease of deployment</td>
      <td class="pain-low">Easy, git-push deploy</td>
    </tr>
    <tr>
      <td>Avoids writing or maintaining a webserver</td>
      <td class="pain-extreme">No</td>
    </tr>
    <tr>
      <td>Serves files using a CDN</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>SSL on your own domain</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>Supports pre-rendering for bots</td>
      <td class="pain-high"><a href="http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/header-caching.html" target="_blank">Potentially possible by adjusting caching based on User-Agent</a></td>
    </tr>
    <tr>
      <td>HTML5 pushState support</td>
      <td class="pain-medium">Possible</td>
    </tr>
    <tr>
      <td>Proxies backend to avoid CORS issues</td>
      <td class="pain-medium">Possible</td>
    </tr>
    <tr>
      <td>Price for a basic, production site</td>
      <td>$25/month + traffic-based charges for CloudFront (very cheap)</td>
    </tr>
    <!-- ### Custom Server on Heroku + MaxCDN -->
    <tr>
      <th colspan="2">Custom Server on Heroku + CloudFront</th>
    </tr>
    <tr>
      <td>Ease of deployment</td>
      <td class="pain-low">Easy, git-push deploy</td>
    </tr>
    <tr>
      <td>Avoids writing or maintaining a webserver</td>
      <td class="pain-extreme">No</td>
    </tr>
    <tr>
      <td>Serves files using a CDN</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>SSL on your own domain</td>
      <td class="pain-low">Yes</td>
    </tr>
    <tr>
      <td>Supports pre-rendering for bots</td>
      <td class="pain-medium">Possible with EdgeRules</td>
    </tr>
    <tr>
      <td>HTML5 pushState support</td>
      <td class="pain-medium">Possible</td>
    </tr>
    <tr>
      <td>Proxies backend to avoid CORS issues</td>
      <td class="pain-medium">Possible</td>
    </tr>
    <tr>
      <td>Price for a basic, production site</td>
      <td>$25/month + MaxCDN charges (see Amazon + MaxCDN section)</td>
    </tr>
  </tbody>
</table>

So what's my recommendation? If don't need your app to be indexed on Google, <a href="https://developers.facebook.com/tools/debug/" target="_blank">show previews on Facebook's Open Graph</a>, or <a href="https://dev.twitter.com/cards/getting-started" target="_blank">show cards on Twitter</a>, both Firebase Hosting and Aerobatic are good options. In theory, Googlebot is starting to crawl SPAs, but in practice I have not had good luck with that. The other crawlers seem to be far behind Google, so you'll likely need pre-rendered pages, anyway.

If you do need to support bots by serving pre-rendered HTML, you are unfortunately at a real loss. I think your best option in that case is to host your front-end on Heroku (using NGINX, Express, Hapi, or some other simple server), and use a service like <a href="https://prerender.io/" target="_blank">Prerender.io</a> to serve pre-rendered HTML to bots. See <a href="https://gist.github.com/thoop/8165802" target="_blank">here</a> for how you would set up Prerender.io using NGINX. Alternatively, you can let the Firebase Hosting guys know that you really want pre-rendering support in <a href="https://github.com/firebase/firebase-tools/issues/33" target="_blank">this PR</a>.
