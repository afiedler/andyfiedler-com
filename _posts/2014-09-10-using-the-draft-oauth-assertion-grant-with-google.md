---
layout: post
status: publish
published: true
title: Using the Draft OAuth Assertion Grant with Google+
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 283
wordpress_url: http://andyfiedler.com/?p=283
date: '2014-09-10 14:38:35 -0400'
date_gmt: '2014-09-10 18:38:35 -0400'
categories:
- Tech Notes
- Web Development
tags:
- oauth
- google+
---
The IETF has been working on a <a href="https://tools.ietf.org/html/draft-ietf-oauth-assertions-17">new OAuth standard for "assertions"</a> which enables OAuth to work with other types of authentication systems. This can be used to allow users to authenticate with your API through Google+ or other third-party identity providers.

For example, let's say you are developing a single-page Javascript app or a mobile app that uses both Google's APIs as well as your own APIs. You'd like to have users authenticate with Google to obtain access to Google's APIs, but then you'd also like your app to authenticate with your server to gain access to some additional resources. You'd like to not reinvent the wheel and use OAuth for your own API. You also implicitly trust Google to verify the user's identity, so you don't want the user to need to go through another OAuth flow just to use your API.

Assertion grants allow you to do this in a standards-compliant way. This is a draft standard that was just submitted in July of 2014, but for this simple use-case, it is already fairly usable.
<h2>How Google+ handles sign in for "combination" apps (with both a client and a server)</h2>
Google has <a href="https://developers.google.com/+/web/signin/server-side-flow#step_6_send_the_authorization_code_to_the_server">some great documentation on how to authenticate both a client and a server</a>, which is worth reading if you plan on implementing this. The gist of it is that first the client authenticates with Google through a OAuth popup or redirect. This gives the client both an access token and an access code. The code is then passed to the server to authenticate the backend.

This "passing the code to the backend step" is what OAuth assertion grants enable in a standards-compliant way.
<h2>OAuth Assertion Grants</h2>
The IETF Assertion Grant spec defines a way to define new grant types that are assertions of identity from third parties. An assertion grant looks like this (from the <a href="https://tools.ietf.org/html/draft-ietf-oauth-assertions-17#section-4.1">example in the spec</a>):
<pre class="lang:js decode:true">{
   "grant_type": "urn:ietf:params:oauth:grant-type:saml2-bearer",
   "assertion": "PHNhbWxwOl...[omitted for brevity]...ZT4",
   "scope": ""
}</pre>
Assertions are very similar to <a href="http://tools.ietf.org/html/rfc6749#section-4.3">Resource Owner Password Credential grants</a> in that they are passed as HTTP POSTs directly to the <code>/token</code> endpoint. The "grant_type" for an assertion must be a absolute URI that defines the assertion type, the "assertion" is a Base64-encoded string (using URL-safe encoding) that contains the actual asserrtion, and the "scope" is the same as other OAuth grant types.
<h2>An OAuth Assertion Grant for Google+</h2>
Since Google has not defined an assertion grant format for Google+ identity, I've decided to make one up! You can feel free to steal this format for your own apps.
<pre class="lang:js decode:true">{
   "grant_type": "urn:googlepluscode",
   "assertion": "(see below)",
   "scope": "(specific to your app)"
}</pre>
For my Google+ assertion grant, I've just chose "urn:googlepluscode" as the URL. This is arbitrary, but Google would need to standardize this so we currently don't have a better option. For the assertion itself, I use a Base64-encoded, url-safe version of this JSON:
<pre lanng:js="" decode:true="">{
   "code": "(access code provided by the front-end when it authenticates with Google)",
   "google_plus_user_id": "(Google+ user ID)"
}</pre>
<h2>Verifying the Google+ assertion grant</h2>
When the backend receives the Google+ assertion grant, it should do these steps to verify it:
<ol>
	<li>Convert the access code into an access token</li>
	<li>Call the <code>/oauth/tokeninfo</code> endpoint with the access token from the previous step</li>
	<li>In the response from the <code>tokeninfo</code> endpoint, confirm these things:
<ol>
	<li>The <code>user_id</code> matches the <code>google_plus_user_id</code> in the assertion</li>
	<li>The <code>issued_to</code> from the <code>tokeninfo</code> response matches the <code>client_id</code> of your application (both the front-end and back-end share the same <code>client_id</code>.</li>
</ol>
</li>
</ol>
Stay tuned for a future post on how to implement this with Rails and <a href="https://github.com/doorkeeper-gem/doorkeeper">Doorkeeper</a>!
