---
layout: post
status: publish
published: true
title: Using Jupyter for Exploring a Heroku Database
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 370
wordpress_url: http://andyfiedler.com/?p=370
date: '2016-03-25 14:59:45 -0400'
date_gmt: '2016-03-25 18:59:45 -0400'
categories:
- Tech Notes
tags:
- python
- jupyter
- pandas
---
If you want to establish a connection to a Heroku database and import data into Jupyter for some analysis, here's some boilerplate to help:

```python
# Python 3
from sqlalchemy import create_engine
import pandas as pd
import subprocess

DATABASE_URL = subprocess.check_output("heroku config:get DATABASE_URL --app <your heroku app name here>", shell=True).decode('utf-8')
engine = create_engine(DATABASE_URL)

result = pd.read_sql_query(
    '''
SELECT * FROM my_table;
    ''',
    con=engine)
```

Now you have `result`, which is a Pandas DataFrame. Happy data exploration!

**Note:** It probably goes without saying this is a **bad idea** to do on a production system. You should use a read-only replica for running queries in production, or use a dump of the database loaded onto another server.
