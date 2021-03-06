---
layout: post
status: publish
published: true
title: Using Gitolite with Redmine
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 40
wordpress_url: http://andyfiedler.com/?p=40
date: '2012-05-14 11:09:38 -0400'
date_gmt: '2012-05-14 15:09:38 -0400'
categories:
- Tech Notes
tags: []
---
<p>I use Gitolite to self-host multiple git projects and Redmine for time-tracking and project management. Redmine has a cool feature where it can integrate with source control management systems, but getting it to work with Gitolite was a bit of a challenge. Here's how I did it.</p>
<p>First, create a new repository in Gitolite. You're going to want to mirror a read-only version somewhere for Redmine to access. Then, we'll keep them synced using a post-receive hook in Git. After you create your new Gitolite repo, login to your server and go to a folder where you'll keep a mirror for Redmine. In this example, I'll use <code>&#47;var&#47;gitolite-mirrors&#47;<&#47;code>. In that folder, type this to create a mirror of your Gitolite repo and, critically, make git change the permissions of new files to 0644 (which gives read access to all users). Note that # means run as root.</p>
<pre class="lang:default highlight:0 decode:true"># git clone --mirror &#47;home&#47;git&#47;repositories&#47;my-new-repo.git<br />
# cd my-new-repo.git<br />
# git config --add core.sharedRepository 0644<&#47;pre><br />
Now, change the permissions so that the git user (the user that Gitolite runs as) owns this folder.</p>
<pre class="lang:default highlight:0 decode:true"># chown -R git:git ..&#47;my-new-repo.git<&#47;pre><br />
Finally, we'll add a post-receive hook to the Gitolite repo. Go to <code>&#47;home&#47;git&#47;repositories&#47;my-new-repo.git&#47;hooks<&#47;code>. Add a new file called <code>post-receive<&#47;code>, and enter this into the file:</p>
<pre class="lang:default highlight:0 decode:true">#!&#47;bin&#47;sh<br />
&#47;usr&#47;bin&#47;git push --mirror &#47;var&#47;gitolite-mirrors&#47;my-new-repo.git<&#47;pre><br />
Then, you'll want to change the ownership and permissions on that.</p>
<pre class="lang:default highlight:0 decode:true crayon-selected"># chown git:git post-receive<br />
# chmod 700 post-receive<&#47;pre><br />
In Redmine, go to your project you want to associate with this repo. Click the Settings, then Repository tabs. Choose Git as your SCM. In this example, you'd enter <code>&#47;var&#47;gitolite-mirrots&#47;my-new-repo.git<&#47;code> as your repository path. Click "Save".</p>
<p>Now, click the Repository tab on the top tab bar. You may get a 404 error at this point. That is because you need to push a master branch to this repository (it is empty right now). Push a few files to the repo and check again.</p>
<p>If it is still not working, you can log in to your server and navigate to the mirror location (<code>&#47;var&#47;gitolite-mirrors&#47;my-new-repo.git<&#47;code>). Switch users to the user your Redmine process is running as (probably www-data or something similar). Redmine is running <code>git log master<&#47;code> to get the changes from your repo to display on the webpage. Try running that command and see if you get any errors, and debug from there.</p>
