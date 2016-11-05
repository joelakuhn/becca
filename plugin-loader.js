var fs = require('fs');
var path = require('path');
var NodeSet = require('./nodeset.js');

function get_package_root() {

  var package_root = process.cwd();

  try {
    while (true) {

      if (fs.existsSync(path.join(package_root, 'package.json'))) {
        return package_root;
      }
      else {
        var parent_dir = path.dirname(package_root);
        if (parent_dir == package_root) {
          return false;
        }
        package_root = parent_dir;
      }

    }
  }
  catch (exception) {
    return false;
  }

}

function load_plugins() {

  var package_root = get_package_root();

  if (!package_root) {
    return;
  }

  var modules_directory = path.join(package_root, 'node_modules');

  if (!fs.existsSync(modules_directory)) {
    return;
  }

  var plugins = fs.readdirSync(modules_directory)
  .filter((mod) => mod.match(/^becca-/))
  .map((mod) => path.join(modules_directory, mod));

  plugins.forEach(function(plugin) {
    var plugin_module = require(plugin);
    NodeSet.register(plugin_module);
  });

}


module.exports = {

  load_plugins: load_plugins

}
