var fs = require('fs');

module.exports = {
  name: 'save_as',
  run: function(state, callback, p) {
    fs.writeFile(state.file.path, state.contents, function() {
      callback(null, state);
    });
  },

  path: function(state, args) {
    state.file.path = p;
  }
}
