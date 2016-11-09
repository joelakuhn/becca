var fs = require('fs');

module.exports = {
  name:     'save_to',
  datatype: 'any',

  run: function(state, callback, dir) {
    state.file.setDir(dir);
    fs.writeFile(state.file.path, state.contents, function() {
      console.log('wrote: ', state.file.path);
      callback(state);
    });
  }
}
