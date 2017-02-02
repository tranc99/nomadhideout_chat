var http = require('http');

var fs = require('fs');

var path = require('path');

var mime = require('mime');

var io = require('socket.io');

var cache = {};

// Handle 404s
function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/html'});
  // response.write('Error 404: resource not found :(');
  response.write('<h1>404 error...Welcome my son, welcome to the Machine!</h1>');
  response.end();
}

// Serve files
function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    {"content-type": mime.lookup(path.basename(filePath))}
  );
  response.end(fileContents);
}

// serve cached static files
function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  }
  else {
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, function(err, data) {
          if(err) {
            send404(response);
          }
          else {
            cache[absPath] = data;
            if (absPath == './public/index.html') {
              cache[absPath] = null;
            }
            sendFile(response, absPath, data);
          }
        });
      }
      else {
        send404(response);
      }
    });
  }
}

// our HTTP server
var server = http.createServer(function(request, response) {
  var filePath = false;

  if (request.url == '/') {
    filePath = 'public/index.html';
  }
  else if (request.url == '/favicon.ico') {
    filePath = './favicon.ico';
  }
  else {
    filePath = 'public' + request.url;
  }

  var absPath = './' + filePath;
  serveStatic(response, cache, absPath);
});

io.listen(server);

server.listen(5000, function() {
  console.log("Tomahawk server listening on port 5000");
});
