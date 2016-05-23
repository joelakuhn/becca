var fs = require('fs');

module.exports = {
  name: 'save',
  run: function(state, callback) {
    // fs.mkdirp(file.dir(), function(err) {
    //   if (err) throw err;
      fs.writeFile(state.file.path, state.contents, function() {
        callback(null, state);
      });
    // })
  }
}
