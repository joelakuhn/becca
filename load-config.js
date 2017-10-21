var fs   = require('fs');
var path = require('path');

function load_config() {
  if (fs.existsSync('beccaconfig.js')) {
    try {
      require(path.join(process.cwd(), 'beccaconfig.js'));
    }
    catch (e) {
      var error_match = e.message.match(/becca.+\.(.+) is not a function/);
      if (error_match) {
        console.log('"' + error_match[1] + '"' + ' is not a becca action.');
        process.exit();
      }
      else {
        throw e;
      }
    }

    return true;
  }
  else {
    return false;
  }
}

module.exports = load_config;
