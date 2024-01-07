---
tags: nodejs, node
---

# Understanding HTTP

## Basics of an HTTP transaction

This guide is an in-depth overview of an HTTP transaction occuring over Node.js

This is a basic guide to understanding the common concepts used in Node.js in practice.

A bit of familiarity with `EventEmitters` and `Streams` will also help.

### Creating the server

Any Node.js web server will first needs to be instantiated before any requests from the outside world can be processed. This is done using the `createServer` method.

```js
const http = require('http');

const server = http.createServer((request, response) => {
    // magic happens here!
});
```

Every time an HTTP request is made to this server, the function inside the `createServer` is called.

We can modify this code slightly like this as well:

```js
const http = require('http');
const server = http.createServer();

server.on('request', (request, response) => {
    // magic happens here!
})
```
In order for the web server to listen to requests, we also need to supply the `listen` method and that usually just needs the `PORT_NUMBER`.

### Method, URL and Headers

When handling a request, the first thing you'll probably want to do is look at the method and URL, so that appropriate actions can be taken. Node.js makes this relatively painless by putting handy properties onto the `request` object.

```js
const { method, url } = request;
```

![The `method` and `url` properties](/assets/images/Code_6a2dGm0UcH.png "Method and URL properties")


> **_NOTE:_**  The `request` object is an instance of `IncomingMessage`

The `method` here will always be a normal HTTP method/verb. The `url` is the full URL without the server, protocol or port. For a typical URL, this means everything after and including the third forward slash.

```
www.example.come/home
www.example.come/about


    Internet     Your Domain   Type    Your page
         |           |           |       |
        www.      example.      com/    home

Anything after the `.com` is what is supplied in the `url` value.
```

The headers are located in the `headers` object in the `request` object. They are objects inside an object!

```js
const headers = request.headers;
const userAgent = headers['user-agent'];
```
Or
```js
const { headers } = request;
const userAgent = headers['user-agent'];
```

When we receive these headers from the client, they are all converted to lowercase for keeping things organized.

If the headers are repeated, then their values are overwritten or joined together as comma-separated strings, depending on the header. In some cases, this can be problematic, so `rawHeaders` is also available.

### Request Body

When receiving a `POST` or `PUT` request, the request body

### So far

```js
const http = require('http');

http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request
      .on('error', err => {
        console.error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        // At this point, we have the headers, method, url and body, and can now
        // do whatever we need to in order to respond to this request.
      });
  })
  .listen(8080); // Activates this server, listening on port 8080.
```

This will open up a web server but it won't "process" any requests. The web browser will time out.

So far we haven't touched on the `response` object at all, which is an instance of `ServerResponse`, which is a `WritableStream`. It contains many useful methods for sending data back to the client. We'll cover that next.

### HTTP Status Code


If you don't bother setting it, the status code by default is `200`. In order to modify that (depending on your use case), you can modify the `response.statusCode` property. This is not in the headers!

```js
response.statusCode = 404; // Tell the client that the resource wasn't found.
```

### Setting the response headers

Headers can be set through the `setHeader` method.

```js
response.setHeader('Content-Type', 'application/json');
response.setHeader('X-Powered-By', 'bacon');
```

When setting the headers on a response, the case is insensitive on their names. If you set a header repeatedly, the last value you set is the value that gets sent.

If you want, you can explicitly write the headers to the response stream. To do this, there's a method called writeHead, which writes the status code and the headers to the stream.

```js
response.writeHead(200, {
  'Content-Type': 'application/json',
  'X-Powered-By': 'bacon',
});
```
Once you've set the headers (either implicitly or explicitly), you're ready to start sending response data.

### Sending the response body