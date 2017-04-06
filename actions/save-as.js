var fs = require('fs');

module.exports = {
  name:     'save_as',
  datatype: 'any',

  run: function(state, callback, new_path) {
    fs.writeFile(new_path, state.contents, function() {
      becca.console.log('wrote: ', new_path);
      callback(state);
    });
  },

  path: function(state, new_path) {
    state.file.path = new_path;
  }
}
