var fs = require('fs');

module.exports = {
  name: 'save_to',
  run: function(state, callback, dir) {
    state.file.setDir(dir);
    fs.writeFile(state.file.path, state.contents, function() {
        console.log('wrote: ', state.file.path);
      callback(null, state);
    });
  }
}
