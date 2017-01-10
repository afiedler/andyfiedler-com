---
layout: post
title: Streaming Hapi Responses with MongoDB
---

Let's say you are implementing a REST endpoint that lists a collection. Normally, you'd paginate the endpoint with a
maximum page size of say 25 items to avoid memory issues. You'd return something like this example, and if the client
wants more than one page, it would need to make more than one request:

```json
{
  "data": [
    { "id": 1, "title": "Item 1" },
    { "id": 2, "title": "Item 2" }
  ],
  "pages": {
    "current": 2,
    "prev": 1,
    "hasPrev": true,
    "next": 3,
    "hasNext": true,
    "total": 5
  },
  "items": {
    "perPage": 2,
    "begin": 3,
    "end": 4,
    "total": 9
  }
}
```

This can be a real pain for clients to deal with, especially if the client knows it wants *everything*. With NodeJS,
you may be able to greatly increase the maximum page size or eliminate it completely with streams. This is because
with streams you don't need to buffer the entire response before sending it. You can send the response piece by piece,
greatly reducing the memory demands on the server.

If you are using MongoDB, you can get a streaming response from the database like this:

```js
const mongoStream = db.collection('items').find({}).stream();
```

This will be an `objectMode` stream, with each object one document from your MongoDB collection. HapiJS also supports
streaming responses like this:

```js
// Within your handler
return reply(responseStream);
```

HapiJS response streams should be in binary mode or in `objectMode` emitting strings. You can't just connect your
MongoDB stream to HapiJS because you need to construct a valid JSON object so the client can parse it. To do that, you
can pipe your MongoDB stream through a `Transform` stream that takes in MongoDB documents and emits a JSON object piece
by piece that will look like the response above. Here's an example of a stream that does that:

```js
// PaginationStream.js
const Transform = require('stream').Transform;
const assert = require('assert');

class PaginationStream extends Transform {
  /**
   * Create a PaginationStream
   * @param page {Number} which page of data will be streamed through
        (starting with 1)
   * @param perPage {Number} how many objects are returned per page
        (>= 0; if 0, then return all objects)
   * @param total {Number} the total number of results (>= 0)
   */
  constructor(page, perPage, total) {
    assert(page >= 1 , 'page should be >= 1');
    assert(perPage >= 0, 'perPage should be >= 0');
    assert(total >= 0, 'total should be >= 0');
    super({ objectMode: true });
    this.page = page;
    this.perPage = perPage;
    this.total = total;
    this.count = 0;
    this.perPageReached = false;
  }

  _transform(data, encoding, callback) {
    if (this.perPageReached) {
      return callback(
        new Error('pagination page limit already reached')
      );
    }

    if (this.count === 0) {
      this.push('{\n  "data":[');
    }

    this.push(JSON.stringify(data, null, 2));
    this.count++;

    // When we reach the limit or the total number of objects, emit an
    // end of array marker and the pagination object
    if (this._isEndOfPage()) {
      this.perPageReached = true;
      const pagination = PaginationStream._paginationObject(
        this.page,
        this.total,
        this.perPage
      );
      const paginationJson = JSON
        .stringify(pagination, null, 2)
        .replace(/^{/, '');
      this.push('], ');
      this.push(paginationJson);
    } else {
      this.push(',');
    }

    return callback();
  }

  _isEndOfPage() {
    if (this.perPage > 0) {
      // Has a per-page limit if perPage > 0
      return this.count === Math.min(this.total, this.perPage);
    } else {
      // No per-page limit if perPage === 0
      return this.count === this.total;
    }
  }

  /**
   * Returns a pagination object
   * @param page {Number} current page number
   * @param total {Number} total number of objects
   * @param perPage {Number} number of objects per page
   * @private
   */
  static _paginationObject(page, total, perPage) {
    const countNum = perPage === 0 ? total : perPage,
      begin = (page-1) * countNum + 1,
      end = (page * countNum) > total ? total : (page * countNum);

    return {
      pages: {
        current: page,
        prev: page - 1,
        hasPrev: page > 1,
        next: page + 1,
        hasNext: total > end,
        total: Math.ceil(total / countNum)
      },
      items: {
        perPage,
        begin,
        end,
        total
      }
    };
  }
}

module.exports = PaginationStream;
```

You can use these streams together like this:

```js
const total = db.collection('items').find({}).count();
const mongoStream = db.collection('items').find({}).stream();
const paginationStream = new PaginationStream(1, 0, total);

return reply(mongoStream.pipe(paginationStream));
```

This is pretty good, but if the response is large, we really need to gzip it. Luckily, Node provides a GZip stream that
we can use.

```js
db.collection('items').find({}).count((err, total) => {
  const mongoStream = db.collection('items').find({}).stream();
  const paginationStream = new PaginationStream(1, 0, total);
  const gzipStream = createGzip();

  const stream = mongoStream.pipe(paginationStream).pipe(gzipStream);

  return reply(stream).header('content-encoding', 'gzip');
});
```

There are a few edge cases that we need to deal with, though:
1. If your response is taking a really long time, the user could close the tab of the browser which would close the
socket. If the socket is closed, we need to stop the stream both to save resources and because the gzip stream will emit
an error if we try to send data to it after the socket closes.
2. There could be some kind of MongoDB error mid-stream (unlikely, but I'll show you how to handle it anyway)

To handle these edge cases, we'll attach error handlers to the streams and log the errors. Whenever an error handler is
attached to a stream, Node will assume the application is dealing with the error. If there is no error handler on a
stream, any error in the stream causes the process to quit like an unhandled exception.

Here's the code with error handlers added. Maybe there is a more concise way just trapping all errors, but this is what
is working for me:

```js
db.collection('items').find({}).count((err, total) => {
  const mongoStream = db.collection('items').find({}).stream();
  mongoStream.on('error', err => {
    request.log(['warn'], { stream: 'mongo', err });
  });

  const paginationStream = new PaginationStream(1, 0, total);
  paginationStream.on('error', err => {
    request.log(['warn'], { stream: 'pagination', err });
    mongoStream.close();
  });

  const gzipStream = createGzip();
  paginationStream.on('error', err => {
    request.log(['warn'], { stream: 'gzip', err });
  });

  // Handle the browser cancelling the request
  request.raw.req.once('close', () => {
    request.log(
    ['debug'],
    {
      msg: 'stream closed due to client cancellation'
    });
    return mongoStream.close();
  });

  const stream = mongoStream.pipe(paginationStream).pipe(gzipStream);

  return reply(stream).header('content-encoding', 'gzip');
});
```

There you go! MongoDB streaming HTTP requests using Hapi. A few other things to keep in mind:
* You need to change the Mongo `.find()` and `.count()` calls to also implement your pagination logic. You should use
`.sort()`, `.seek()` and `.limit()` to only return one page of data from the database. If you return more than a page of
data, PaginatedStream will emit an error event.
* When using streaming responses, the headers are sent as soon as the first bit of data comes down the stream. There is
no way to change the headers after data has been sent, so you *cannot* change the HTTP status code of the response if
there is an error mid-stream. I might do another post on some strategies to deal with that issue later.

