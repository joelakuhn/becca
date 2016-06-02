var fs = require('fs');

module.exports = {
  name: 'save_as',
  run: function(state, callback) {
    fs.writeFile(state.file.path, state.contents, function() {
      console.log('wrote: ', state.file.path);
      callback(null, state);
    });
  },

  path: function(state, p) {
    state.file.path = p;
  }
}
