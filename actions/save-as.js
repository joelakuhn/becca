var fs = require('fs');

module.exports = {
  name: 'save_as',
  run: function(state, callback, new_path) {
    fs.writeFile(new_path, state.contents, function() {
      console.log('wrote: ', new_path);
      callback(null, state);
    });
  },

  path: function(state, new_path) {
    state.file.path = new_path;
  }
}
