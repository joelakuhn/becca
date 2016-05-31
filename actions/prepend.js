module.exports = {
  name: 'prepend',
  run: function(state, callback, file) {
    var fs = require('fs');
    fs.readFile(file, function(err, buffer) {
      if (err) {
        callback(err);
      }
      else {
        state.contents = buffer.toString('utf8') + state.contents;
        callback(err, state);
      }
    });
  }
}
