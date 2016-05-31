becca.task('serve', function(args) {
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
        fs.readFile(file_path, function(err, contents) {
          if (err) {
            res.write('error: ' + err);
            res.end()
          }
          else {
            console.log('served: ' + file_path);
            res.write(contents);
            res.end();
          }
        });
      }
      else {
        res.status = 404;
        res.write('not found: ' + req.url);
        res.end();
      }
    });
  });
  server.listen(port);

}, {
  '-p': { alias: 'port' }
})