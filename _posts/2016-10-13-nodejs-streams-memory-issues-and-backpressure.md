---
layout: post
title: Memory Issues with NodeJS Streams? Remove 0.8.x Streams from Your Pipe
---

I was working on an ETL process with NodeJS that ran on Heroku, which limits you to 500MB of
memory on a standard dyno. The ETL was quickly running out of memory, even through each
document that it processed was less than 1MB.

This ETL was made up of a `Readable` stream from a MongoDB `Cursor`, then two `Transform`
streams, one using [`event-stream`](https://github.com/dominictarr/event-stream) and one 
implemented as a subclass of `Stream.Transform`. The last stream was a `Writable` stream
that validated and wrote back documents to MongoDB.

Clearly the readable stream was reading documents out of Mongo way too quickly for the
transform streams to do their work and the writable stream to write the documents back to
MongoDB. But wasn't NodeJS suppose to manage this automatically, assuming the `highWaterMark`
was set to something reasonable?

It turns our that, yes, NodeJS does manage this correctly, as long as *every stream in your pipe
is a 0.10.x stream or greater*. NodeJS implemented the 
[`highWaterMark` in Node 0.10.x](https://nodejs.org/en/blog/feature/streams2/).

The culprit in my case was `event-stream`, which is an old library that only makes 0.8.x streams.

Moral of the story: if you are having memory issues with streams that seem like backpressure
should be solving, make sure all of the streams in your pipe are 0.10.x streams or greater!

Test