var fs = require('fs');

module.exports = {
  name:     'save',
  datatype: 'any',

  run: function(state, callback) {
    // fs.mkdirp(file.dir(), function(err) {
    //   if (err) throw err;
      fs.writeFile(state.file.path, state.contents, function() {
        console.log('wrote: ', state.file.path);
        callback(state);
      });
    // })
  }
}
