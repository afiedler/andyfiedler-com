---
layout: post
status: publish
published: true
title: Using Capistrano to deploy Rails apps from Gitolite
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 150
wordpress_url: http://andyfiedler.com/?p=150
date: '2012-08-23 17:29:25 -0400'
date_gmt: '2012-08-23 21:29:25 -0400'
categories:
- Tech Notes
tags: []
---
<p>Here, I'll show you how to deploy a Rails app from a Gitolite repository via Capistrano. In this example, I'm running a Phusion Passenger on NGINX on Ubuntu 10.04. The instructions should be very similar for Ubuntu 12.04.</p>
<p>First, understand what we're doing here. I'm assuming you are using Gitolite for version control (although similar instructions would probably work for Github). We're going to add a read-only deployment key to the Gitolite repository. When you run <code>cap deploy<&#47;code>, Capistrano will log into your production server via SSH (using public key authentication). Then the Capistrano script will instruct the production server to check out the latest version of your app from the Gitolite repository into a directory on the production server. Finally, the Capistrano script will change a symlink to the new version of your app and instruction Phusion Passenger to reload the app into memory on the next hit.</p>
<h2>Setting up your production server<&#47;h2><br />
Create a new user for deployment-related tasks on your production server. Switch to that user.</p>
<pre class="lang:sh">sudo adduser deployuser<br />
sudo su - deployuser<&#47;pre><br />
Now, generate some SSH keys for that user. Run as the deployuser:</p>
<pre class="lang:sh">ssh-keygen -t rsa<&#47;pre><br />
I don't typically enter a password for this keypair. The reason is that this keypair is only used for read-only access to your code repository in Gitolite. If your code is highly sensitive, you might want a password. If you enter one here, you will be prompted for it each time you deploy code.</p>
<p>Now, wherever you have your Gitolite admin repository checked out, open it up and add the public key to your keydir folder. I like to keep my deployment keys in a subfolder called something like "deployment".</p>
<p>Say, for example, your Gitolite admin repository is at <code>~&#47;repos&#47;gitolite-admin<&#47;code>. Switch to that path. Now enter the folder <code>keydir<&#47;code>. Make a new subfolder called <code>deployment<&#47;code>, and then a new file in that folder called something like <code>MyDeploymentKey.pub<&#47;code>. Open that file in your editor and paste the public key that you just created from your deployment server. Typically, that key is found at <code>~&#47;.ssh&#47;id_rsa.pub<&#47;code>.</p>
<p>Now, open your <code>gitolite.conf<&#47;code> file (in the <code>conf<&#47;code> folder in your Gitolite repository). Find your project and add a directive to grant your deployment key read-only access. Here's an example project section:</p>
<pre class="lang:default highlight:0 decode:true crayon-selected">repo     my-project<br />
         RW = JoeCoder<br />
         R = MyDeploymentKey<&#47;pre><br />
Note that even though the deployment key could be in a subfolder, you still just enter the filename minus the ".pub".</p>
<p>Save the Gitolite files, commit and push to your Gitolite server.</p>
<h2>Setting up Capistrano<&#47;h2><br />
Now, open up your Rails project you want to deploy. Add these gems:</p>
<pre class="lang:ruby"># Gems for deployment<br />
group :development do<br />
  gem "capistrano"<br />
  gem 'rvm-capistrano'<br />
end<&#47;pre><br />
Run <code>bundle install<&#47;code> and then from the top directory of your project, run <code>capify .<&#47;code>. This adds Capistrano to your project. Open up <code>config&#47;deploy.rd<&#47;code> and add something like this:</p>
<pre class="lang:ruby">require "bundler&#47;capistrano"<br />
require "rvm&#47;capistrano"</p>
<p>set :application,   "myapp"<br />
set :domain,        "mydomain.com"<br />
set :repository,    "git@mygitoliteserver.com:mygitrepo"<br />
set :use_sudo,      false<br />
set :deploy_to,     "&#47;srv&#47;mydomain.com&#47;public&#47;#{application}"<br />
set :scm,           "git"<br />
set :user,          "deployuser"</p>
<p>role :app, domain<br />
role :web, domain<br />
role :db, domain, :primary => true</p>
<p># Add RVM's lib directory to the load path.<br />
set :rvm_ruby_string, 'ruby-1.9.3-p358'<br />
set :rvm_type, :system</p>
<p>namespace :deploy do<br />
  task :start, :roles => :app do<br />
    run "touch #{current_release}&#47;tmp&#47;restart.txt"<br />
  end</p>
<p>  task :stop, :roles => :app do<br />
    # Do nothing.<br />
  end</p>
<p>  desc "Restart Application"<br />
  task :restart, :roles => :app do<br />
    run "touch #{current_release}&#47;tmp&#47;restart.txt"<br />
  end</p>
<p>end<&#47;pre><br />
This deploy script will checkout your code from the project myproject on mygitoliteserver.com and deploy it to <code>&#47;srv&#47;mydomain.com&#47;public<&#47;code> on your production server (make sure you create this directory). Whenever you deploy, Capistrano will touch <code>tmp&#47;restart.txt<&#47;code> so that Phusion Passenger restarts with the new code.</p>
<p>Once you are finished editing this script, commit your changes, push your latest code to your Gitolite server.</p>
<h2>Deciding who gets to deploy<&#47;h2><br />
For each user you want to allow to deploy code, have them generate a SSH key. On your deployment server, open or create <code>~deployuser&#47;.ssh&#47;authorized_keys<&#47;code>. For each user you want to allow to deploy, add their public key (one key per line) to this file.</p>
<h2>Deploying!<&#47;h2><br />
Now, to test out deployment, run from your Rails root on your development machine (the machine that has the SSH key you added to <code>~deployuser&#47;.ssh&#47;authorized_keys<&#47;code>), run <code>cap deploy<&#47;code>.</p>
