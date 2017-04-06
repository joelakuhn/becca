var verbose = false;

function get_mimetype(extension) {
  switch (extension.toLowerCase()) {
    case 'html':
    case 'html':  return 'text/html'
    case 'js':    return 'application/x-javascript'
    case 'css':   return 'text/css'
    case 'jpg':
    case 'jpeg':  return 'image/jpeg'
    case 'png':   return 'image/png'
    case 'gif':   return 'image/gif'

    case 'au':    return 'audio/basic'
    case 'avi':   return 'video/avi'
    case 'bmp':   return 'image/bmp'
    case 'bz2':   return 'application/x-bzip2'
    case 'dtd':   return 'application/xml-dtd'
    case 'doc':   return 'application/msword'
    case 'exe':   return 'application/octet-stream'
    case 'gz':    return 'application/x-gzip'
    case 'hqx':   return 'application/mac-binhex40'
    case 'jar':   return 'application/java-archive'
    case 'midi':  return 'audio/x-midi'
    case 'mp3':   return 'audio/mpeg'
    case 'mpeg':  return 'video/mpeg'
    case 'ogg':   return 'audio/vorbis, application/ogg'
    case 'pdf':   return 'application/pdf'
    case 'pl':    return 'application/x-perl'
    case 'ppt':   return 'application/vnd.ms-powerpoint'
    case 'ps':    return 'application/postscript'
    case 'qt':    return 'video/quicktime'
    case 'ra':    return 'audio/x-pn-realaudio'
    case 'ram':   return 'audio/x-pn-realaudio'
    case 'rdf':   return 'application/rdf'
    case 'rtf':   return 'application/rtf'
    case 'sgml':  return 'text/sgml'
    case 'sit':   return 'application/x-stuffit'
    case 'svg':   return 'image/svg+xml'
    case 'swf':   return 'application/x-shockwave-flash'
    case 'tar':   return 'application/x-tar'
    case 'tgz':   return 'application/x-tar.gz'
    case 'tiff':  return 'image/tiff'
    case 'tsv':   return 'text/tab-separated-values'
    case 'txt':   return 'text/plain'
    case 'wav':   return 'audio/wav'
    case 'xls':   return 'application/vnd.ms-excel'
    case 'xml':   return 'application/xml'
    case 'zip':   return 'application/zip'
  }
}

function write_mime(res, file_path) {
  var extension_match = file_path.match(/.*\.(.+?)$/);
  if (extension_match) {
    var extension = extension_match[1];
    var mimetype = get_mimetype(extension);
    if (mimetype) {
      res.setHeader('Content-Type', mimetype);
    }
  }
}

function serve_file(req, res, file_path) {
  var fs = require('fs');

  fs.readFile(file_path, function(err, contents) {
    if (err) serve_error(err);
    else {
      if (verbose) becca.console.log('200: ' + file_path);
      write_mime(res, file_path);
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
  if (verbose) becca.console.log('404: ' + req.url)
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
  verbose = args.verbose

  if (verbose) becca.console.log('serving ' + root + ' on port ' + port);

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
  '-p': { alias: 'port' },
  '--verbose': { name: 'verbose', flag: true },
  '-v': { alias: '--verbose' }
};

becca.task(['serve', 'server', 's'], serve, arg_spec);