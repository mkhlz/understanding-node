// declare the http module
const http = require('node:http');

// hostname
const hostname = '127.0.0.1';

//
const port = 3000;

// run a basic server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

// listen to requests
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});