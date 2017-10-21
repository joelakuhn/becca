var cwd = process.cwd();
var path = require('path');

module.exports = function(package_name) {
  return require(path.join(cwd, 'node_modules', package_name));
}