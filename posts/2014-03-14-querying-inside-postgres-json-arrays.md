---
layout: post
status: publish
published: true
title: Querying Inside Postgres JSON Arrays
author:
  display_name: afiedler
  login: afiedler
  email: andy@andyfiedler.com
  url: ''
author_login: afiedler
author_email: andy@andyfiedler.com
wordpress_id: 260
wordpress_url: http://andyfiedler.com/?p=260
date: '2014-03-14 12:17:58 -0400'
date_gmt: '2014-03-14 16:17:58 -0400'
categories:
- Tech Notes
tags: []
redirect_from:
  - /blog/querying-inside-postgres-json-arrays-260/
  - /blog/querying-inside-postgres-json-arrays-260
---
Postgres JSON support is pretty amazing. I've been using it extensively for storing semi-structured data for a project and it has been great for that use case. In Postgres 9.3, the maintainers added the ability to perform some simple queries on JSON structures and a few functions to convert from JSON to Postgres arrays and result sets.

One feature that I couldn't figure out how to implement using the built-in Postgres functions was the ability to query within a JSON array. This is fairly critical for lots of the reporting queries that I've been building over the part few days. Suppose you have some JSON like this, stored in two rows in a table called "orders", in the column "json_field":

```js
// Row 1, "json_field" column -----
{
   "products": [
      { "id": 1, "name": "Fish Tank" },
      { "id": 2, "name": "Bird Feeder" }
   ]
}

// Row 2, "json_field" column -----
{
   "products": [
      { "id": 2, "name": "Bird Feeder" },
      { "id": 3, "name": "Cat Pole" }
   ]
}
```

If you want to run a query like "find all distinct IDs in the json_field's products array", you can't do that with the built in JSON functions that Postgres currently supplies (as far as I'm aware!). This is a fairly common use case, especially for reporting.

To get this work, I wrote this simple PgPL/SQL function to map a JSON array.

```pgpsql
CREATE OR REPLACE FUNCTION json_array_map(json_arr json, path TEXT[]) RETURNS json[]
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
	rec json;
	len int;
	ret json[];
BEGIN
	-- If json_arr is not an array, return an empty array as the result
	BEGIN
		len := json_array_length(json_arr);
	EXCEPTION
		WHEN OTHERS THEN
			RETURN ret;
	END;

	-- Apply mapping in a loop
	FOR rec IN SELECT json_array_elements#>path FROM json_array_elements(json_arr)
	LOOP
		ret := array_append(ret,rec);
	END LOOP;
	RETURN ret;
END $$;
```

What this function does is given a JSON array as "json_arr" and a JSON path as "path", it will loop through all elements of the JSON array, locate the element at the path, and store it in a Postgres native array of JSON elements. You can then use other Postgres array functions to aggregate it.

For the query above where we want to find distinct product IDs in the orders table, we could write something like this:

```pgpsql
SELECT DISTINCT unnest(json_array_map(orders.json_field#>'{products}', '{id}'::text[]))::text AS "id" FROM orders;
```

That would give you the result:
<pre> id
-----
 2
 3
 1</pre>
Pretty cool!
