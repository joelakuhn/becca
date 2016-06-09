var fs   = require('fs');
var path = require('path');

function load_config() {
  if (fs.existsSync('beccaconfig.js')) {
    require(path.join(process.cwd(), 'beccaconfig.js'));
    return true;
  }
  else {
    return false;
  }
}

module.exports = load_config;
