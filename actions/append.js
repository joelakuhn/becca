module.exports = {
  name: 'append',
  run: function(state, callback, file) {
    var fs = require('fs');
    fs.readFile(file, function(err, buffer) {
      if (err) {
        callback(err);
      }
      else {
        state.contents = state.contents + buffer.toString('utf8');
        callback(null, state);
      }
    });
  }
}
