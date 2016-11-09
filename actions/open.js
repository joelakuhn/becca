module.exports = {
  name:     'open',
  datatype: 'any',

  run: function(state, callback) {
    if (typeof state.contents === 'undefined') {
      var fs = require('fs');
      fs.readFile(state.file.path, function(err, contents) {
        state.contents = contents.toString();
        callback(err, state);
      });
    }
    else {
      callback(state);
    }
  }
}
