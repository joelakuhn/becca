var path     = require('path');

function FilePath(p) {
  this.path = p;
}

FilePath.prototype.filename = function() {
  return path.basename(this.path);
}

FilePath.prototype.dir = function() {
  return path.dirname(this.path);
}

FilePath.prototype.extension = function() {
  return path.extname(this.path);
}

FilePath.prototype.isMin = function() {
  return /\.min\.[^\.]+/.test(this.path);
}

FilePath.prototype.setFilename = function(filename) {
  this.path = path.join(this.dir(), filename);
}

FilePath.prototype.setDir = function(dir) {
  this.path = path.join(dir, this.filename());
}

FilePath.prototype.setExtension = function(extension) {
  this.path = this.path.replace(/(?:\.min)?\.[^\.]+$/, extension);
}

module.exports = FilePath;