---
layout: post
title: Connecting to Heroku Postgres in Python
---

This is for Python 3, using `psycopg2`:
```python
import psycopg2
import subprocess

proc = subprocess.Popen('heroku config:get DATABASE_URL -a my-heroku-app', stdout=subprocess.PIPE, shell=True)
db_url = proc.stdout.read().decode('utf-8').strip() + '?sslmode=require'

conn = psycopg2.connect(db_url)
```

Make sure you've installed Postgres locally with SSL support. Here's how I did it:
```bash
brew install postgres --with-openssl
pip3 install psycopg2
```

For some reason, Postgres.app did not work for me. Instead, I needed to use the Homebrew version.

## Using Pandas to make tables in Jupyter

If you are using Jupyter, you can use Pandas to make nice tables from SQL queries:
```python
from sqlalchemy import create_engine
import pandas as pd
import subprocess

proc = subprocess.Popen('heroku config:get DATABASE_URL -a my-heroku-app', stdout=subprocess.PIPE, shell=True)
db_url = proc.stdout.read().decode('utf-8').strip() + '?sslmode=require'

engine = create_engine(db_url)
pd.read_sql_query('select id, email from users', con=engine)
```

That will give you a nice table like this:
{% picture pandas_jupyter.png %}
