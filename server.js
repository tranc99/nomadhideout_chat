var http = require('http');

var fs = require('fs');

var path = require('path');

var mime = require('mime');

var cache = {};

// Handle 404s
function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found :(');
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