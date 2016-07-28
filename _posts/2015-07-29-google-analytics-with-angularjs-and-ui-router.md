---
layout: post
status: publish
published: true
title: Google Analytics with AngularJS and UI-Router
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 337
wordpress_url: http://andyfiedler.com/?p=337
date: '2015-07-29 12:54:59 -0400'
date_gmt: '2015-07-29 16:54:59 -0400'
categories:
- Scrapbook
tags:
- angularjs
- google-analytics
---
I helped [Clean Slate DC](http://www.cleanslatedc.com/) add Google Analytics to their app last night at [Code For DC](http://codefordc.org) and realized others might not know how to do this. It's pretty simple, but you won't want to follow the directions on Google Analytics exactly. Instead, add this to your `index.html` or main page `<head>`, replacing your UA code with the UA code that Google gives you:

```html
<!-- Google Analytics -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-XXXX-X', 'auto');
</script>
<!-- End Google Analytics -->
```

Next, add a service to your Angular project:

```javascript
angular.module("app").service('Analytics', function() {

  this.recordPageview = function(url) {
    ga('set', 'page', url);
    ga('send', 'pageview');
  };

});
```

Finally, add a run block near where your app starts:

```javascript
angular.module("app").run(function($rootScope, $location, Analytics) {
  $rootScope.$on('$stateChangeSuccess', function() {
    Analytics.recordPageview($location.url());
  });
});
```

There you go!
