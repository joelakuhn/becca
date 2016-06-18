function serve_file(req, res, file_path) {
  var fs = require('fs');

  fs.readFile(file_path, function(err, contents) {
    if (err) serve_error(err);
    else {
      console.log('served: ' + file_path);
      res.write(contents);
      res.end();
    }
  });
}

function serve_directory(req, res, file_path) {
  var fs = require('fs');
  var path = require('path');

  fs.readdir(file_path, function(err, files) {
    if (err) server_error(err);
    else {
      res.write('<h1>Directory Listing</h1>');
      for (var i=0; i<files.length; i++) {
        res.write('<a href="' + path.join(req.url, files[i]) + '">' + files[i] + '</a><br />');
      }
      res.end()
    }
  })
}

function server_error(req, res, error) {
  res.write('error: ' + error);
  res.end()
}

function serve_path(req, res, file_path) {
  var fs = require('fs');

  fs.lstat(file_path, function(err, stats) {
    if (err) serve_error(req, res, err);
    else {
      if (stats.isDirectory()) {
        serve_directory(req, res, file_path);
      }
      else {
        serve_file(req, res, file_path);
      }
    }
  })
}

function serve_404(req, res) {
  res.status = 404;
  res.write('not found: ' + req.url);
  res.end();
}

function serve(args) {
  var http = require('http');
  var path = require('path');
  var fs = require('fs');

  var root = args[0] || '.';
  var port = args.port || 3000;

  console.log('serving ' + root + ' on port ' + port);

  var server = http.createServer(function(req, res) {
    var url = req.url.match(/(.*)\??.*/)[1];
    var file_path = path.join(root, url);
    fs.exists(file_path, function(exists) {
      if (exists) {
        serve_path(req, res, file_path);
      }
      else {
        serve_404(req, res);
      }
    });
  });
  server.listen(port);
}

var arg_spec = {
  '-p': { alias: 'port' }
};

becca.task(['serve', 's'], serve, arg_spec);