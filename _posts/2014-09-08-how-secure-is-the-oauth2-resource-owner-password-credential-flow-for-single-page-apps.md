---
layout: post
status: publish
published: true
title: How secure is the OAuth2 "Resource Owner Password Credential" flow for single-page
  apps?
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 282
wordpress_url: http://andyfiedler.com/?p=282
date: '2014-09-08 15:07:47 -0400'
date_gmt: '2014-09-08 19:07:47 -0400'
categories:
- Tech Notes
- Web Development
tags:
- oauth
---
I've been working on a single-page, browser-based app and I was investigating using the OAuth2 "Resource Owner Password Credential" (ROPC) flow to log users in without needing a normal OAuth popup or redirect. The single-page app is written by the same developers as the backend API, so it is more trusted than a third-party application (which should <em>never</em> touch a user's password). However, since it is a client-side application in Javascript, it was unclear to me how to take steps to make this as secure as possible, so I did some research. In this post, I'll describe what I found.
<h2>What the OAuth spec says</h2>
The OAuth spec is a dense monster, but is worth digging into since so many sites are using OAuth today. The <a href="http://tools.ietf.org/html/rfc6749#section-4.3" target="_blank">relevant section of the spec</a> says that the ROPC flow can be used when the resource owner (the user) "has a trust relationship with the client, such as the device operating system or a highly privileged application", which would apply to an application developed by the same developers as the API server. The spec also says that it should only be used when other flows are "not viable". This isn't strictly the case for single-page Javascript applications, which can use the <a href="http://tools.ietf.org/html/rfc6749#section-1.3.2" target="_blank">Implicit Grant</a> flow or the <a href="http://tools.ietf.org/html/rfc6749#section-1.3.1" target="_blank">Authorization Code</a> flow. However, for clients "owned" by the same owner as the authorization server, the OAuth popup or redirect can be a poor user experience and may confuse users since they wouldn't expect to "authorize" an app that they perceive as one and the same as the service itself. So, assuming you trust the client and are willing to consider "bad user experience" as "not viable", you could use the ROPC flow for a front-end client.

The other issue is that Javascript clients cannot disguise their client credentials because the user may just "view source" to retrieve the credentials. This makes <a href="https://tools.ietf.org/html/draft-ietf-oauth-v2-31#section-10.2" target="_blank">client impersonation</a> possible. It also means the the client is a "public" client for the purposes of the OAuth spec, and client authentication is not possible. The OAuth spec states that when client authentication is not possible, the authorization server SHOULD employ other means to validate the client's identity.
<h2>How can we "validate the client's identity" as best as possible with Javascript clients?</h2>
First, we need to accept that because that this is a public client under control of the user, we'll have to accept that it is impossible to completely prevent client impersonation. You always could impersonate a client with cURL or a web scraper, which is something that is out of the control of the API owner. To prevent this, we'd need some kind of trusted computing architecture where we are 100% certain that the client credentials are protected from prying eyes.

Since we can't completely prevent client impersonation, we need to define what types of impersonation we are trying to prevent. For Javascript clients, I want to prevent two types of impersonation:
<ol>
	<li>Impersonation by another Javascript client running in a standards-compliant browser on a domain other the official client's domain</li>
	<li>Compromised client Javascript or HTML</li>
</ol>
Both types of impersonation are already well-known and have solutions in other Internet standards that we can use for this case.
<h3>Preventing compromised client source code</h3>
For this one, we can simply use SSL for the client's domain. If the source code has been compromised through a man-in-the-middle attack, the user will see an SSL error in the browser. The OAuth spec already requires that communication to the authorization server's token and authorization endpoints occur over SSL. It is permitted in the OAuth spec to have a client delivered over HTTP, however.

In order to use the ROPC grant type for Javascript clients, we need to be more strict than the spec and absolutely ensure that the client is delivered over SSL. If the Javascript client is not delivered over SSL, a middleman could tamper with the client's Javascript to intercept either the resource owner's credentials or the access token. This makes it impossible for the resource owner to trust the client, which breaks the first chain of trust between the resource owner and the authorization server.
<h3>Preventing impersonation by other Javascript clients</h3>
The other kind of impersonation we'd like to prevent is another Javascript client (on some other domain) using the official client's credentials to retrieve access tokens. To do this, we can use the browser's cross-origin security model.
<h4>If your client is on the same origin as your authentication server</h4>
If you are running a client on the same origin as the authentication server, requests to the authentication server will be permitted through "normal" AJAX and I believe that all you will need to do is <em>not</em> permit cross-domain requests (i.e. don't enable CORS) on your authentication server and the ROPC flow will be unavailable to impersonating clients. Here's why:
<ul>
	<li>It is possible to submit a form from another domain to kick off the ROPC flow (a POST to your token endpoint), however, it is not possible for Javascript running on that other domain to access the response. This means that the impersonating Javascript may cause your API server to return an access token via a form submission, but it wouldn't be possible for it to read that token. Since we are not using cookie-based authentication, the client needs to parse the token response for it to become authorized.</li>
	<li>It is not possible for a third-party (an intermediate proxy) to intercept the token in this way because the browser will be communicating with your server over SSL (you are using SSL for your authentication server, right!?).</li>
	<li>You need to ensure that potentially-impersonated POSTs to your token endpoint are not in any way destructive. Typically, CSRF attacks (of which this technically is one) lead to a compromise by either setting a cookie that is later used to access a protected resource or cause a POST that takes an abusive action (withdrawing money). You'll need to ensure that a POST to your token endpoint doesn't do either of these things.</li>
</ul>
<h4>If your client is on a different origin from your authentication server</h4>
If you are running your client on "yourdomain.com" and your API server on "api.yourdomain.com", you will need to implement CORS anyway. In this case, you should leverage CORS to validate the client. Here's how you can do it:
<ul>
	<li>For every ROPC-enabled client, record in your API server's database the acceptable Javascript origins for that client.</li>
	<li>When an incoming ROPC grant type comes in, require your client to provide a client ID. Look up that client ID in your database and confirm that the CORS "Origin" header matches the expected origin. Browsers do not permit Javascript clients to forge the "Origin" header, making this robust against Javascript client spoofing.</li>
</ul>
<h3>Additional considerations</h3>
Since IE9 and below don't implement CORS correctly, many sites implement work-arounds such as iframe proxies or Flash-based work-arounds. I haven't looked into the implications of using these, but they definitely need careful consideration to make sure they are not exploitable.

You absolutely should implement some kind of rate-limiting on your token endpoint to prevent brute-force attacks.

Finally, you should never issue public clients a refresh token (or any long-lived access token). The reason for this is that, depending on your backend architecture, these could be difficult to revoke should you need to revoke access to a specific client. For example, if you are using a <a href="http://jwt.io">JSON Web Token</a> instead of a database record, you would need to blacklist all of them it to revoke them.
