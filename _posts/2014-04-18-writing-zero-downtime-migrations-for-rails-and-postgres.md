---
layout: post
status: publish
published: true
title: Writing Zero-Downtime Migrations for Rails and Postgres
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 265
wordpress_url: http://andyfiedler.com/?p=265
date: '2014-04-18 09:38:26 -0400'
date_gmt: '2014-04-18 13:38:26 -0400'
categories:
- Tech Notes
tags:
- postgres
- rails
---
Let's suppose you are building an app. It is under heavy development and the dev team is cranking out new features left and right. Developers need to continually change the database schema, but you don't want to take down the app for database migrations if at all possible. How the heck do you do this with Rails?

We had this problem recently, and have come up with a procedure that solves it for most small database migrations. The goals of this procedure are to:
<ul>
	<li>Avoid downtime by running database migrations while the app is live</li>
	<li>Avoid too many separate deployments to production</li>
	<li>Keep the application code as clean as possible</li>
	<li>Balance the cost of additional coding with the benefit of having a zero-downtime migration. If the cost or complexity of coding a migration in this way is too great, then a maintenance window is scheduled and the migration is written in a non-zero downtime fashion.</li>
</ul>
The first thing to understand when writing a zero downtime migration is what types of Postgres data definition language (DDL) queries can be run without locking tables. As of Postgres 9.3, the following DDL queries can be run without locking a table:
<pre class="toolbar:2 nums:false nums-toggle:false lang:pgsql decode:true">CREATE INDEX CONCURRENTLY</pre>
<p style="padding-left: 30px;">Postgres can create indexes concurrently (without table locks) in most cases. <code>CREATE INDEX CONCURRENTLY</code> can take significantly longer than <code>CREATE INDEX</code>, but it will allow both reads and writes while the index is being generated.</p>

<pre class="toolbar:2 nums:false nums-toggle:false lang:pgsql decode:true">ALTER TABLE ... ADD COLUMN -- certain cases only!</pre>
<p style="padding-left: 30px;">You can add a column to a table without a table lock if the column being added is nullable and has no default value or other constraints.</p>
<p style="padding-left: 30px;">If you want to add a column with a constraint or a column with a default value, one option may be to add the column first without a default value and no constraint, then in a separate transaction set the default value (using <code>UPDATE</code>)  or use <code>CREATE INDEX CONCURRENTLY</code> to add a index that will be used for the constraint. Finally, a third transaction can add the constraint or default to the table. If the third transaction is adding a constraint that uses an existing index, no table scan is required.</p>

<pre class="toolbar:2 nums:false nums-toggle:false lang:pgsql decode:true">ALTER TABLE ... DROP COLUMN</pre>
<p style="padding-left: 30px;">Dropping a column only results in a metadata change, so it is non-blocking. When the table is <code>VACUUMED</code>, the data is actually removed.</p>

<pre class="toolbar:2 nums:false nums-toggle:false lang:pgsql decode:true">CREATE TABLE, CREATE FUNCTION</pre>
<p style="padding-left: 30px;">Creating a table or a function is obviously safe because no one will have a lock on these objects before they are created.</p>

<h2>Process for Coding the Migration</h2>
The guidelines I have been using for writing a zero-downtime migration are to:
<ul>
	<li><strong>Step 1: </strong>Write the database migration in Rails.</li>
	<li><strong>Step 2: </strong>Modify the application code in such a way that it will work both before and after the migration has been applied (more details on this below). This will probably entail writing code that branches depending on that database state.</li>
	<li><strong>Step 3: </strong>Run your test suite with the modified code in step 2<i> but before you apply the database migration!</i></li>
	<li><strong>Step 4: </strong>Run your test suite with the modified code in step 2 <em>after applying the database migration</em>. Tests should pass in both cases.</li>
	<li><strong>Step 5: </strong>Create a pull request on Github (or the equivalent in whatever tool you are using). Tag this in such a way that whoever is reviewing your code knows that there is a database migration that needs careful review.</li>
	<li><strong>Step 6: </strong>Create a separate pull request on Github that cleans up the branching code you wrote in step 2. The code you write in this step can assume that the DB is migrated.</li>
</ul>
When the migration is deployed, you'll deploy first the code reviewed in step 5. This code will be running against the non-migrated database, but that is a-ok because you have tested that case in step 3. Next, you will run the migration "live". Once the migration is applied, you will still be running the code reviewed in step 5, but against the migrated database. Again, this is fine because you have tested that in step 4.<strong>
</strong>

Finally, once the production database has been migrated, you should merge your pull request from step 6. This eliminates the dead code supporting the unmigrated version of the database. You should write the code for step 6 at the same time you write the rest of this code. Then just leave the pull request open until you are ready to merge. The advantage of this is that you will be "cleaning up" the extraneous code while it is still fresh in your mind.
<h2>Branching Application Code to Support Multiple DB States</h2>
The key to making this strategy work is that you'll need to write you application code in step 2 in a way that supports two database states: the pre-migrated state and the post-migrated state. The way to do this is to check the database state in the models and branch accordingly.

Suppose you are dropping a column called "deleted". Prior to dropping the column, you have a default scope that excludes deleted rows. After dropping the column, you want the default scope to include all rows.

You would code a migration to do that like this:

```ruby
class DropDeletedFromPosts < ActiveRecord::Migration
   def up
     drop_column :posts, :deleted
   end

   def down
      add_column :posts, :boolean, :deleted, default: false, null: false
   end
end
```

Then, in your Post model, you'd add branching like this:

```ruby
class Post < ActiveRecord::Base

   # TODO: Remove this code after the DropDeletedFromPosts migration has
   # been applied.
   if Post.attribute_names.include? 'deleted'
      default_scope -> { where(deleted: false) }
   end

   # Other model code here ...

end
```

<h3> But doesn't this get complicated for larger migrations?</h3>
Yes, absolutely it does. What we do when branching like this and it gets too complicated, we either sequence the DB changes over multiple deployments (and multiple sprints in the Agile sense) or "give up" and schedule a maintenance window (downtime) to do the change.

Writing zero-downtime migrations is not easy, and you'll need to do a cost-benefit analysis between scheduling downtime and writing lots of hairy branching code to support a zero-downtime deploy. That decision will depend on how downtime impacts your customers and your development schedule.

Hopefully, if you decide to go the zero-downtime route, this procedure will make your life easier!
