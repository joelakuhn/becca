var FilePath = require('../file-path.js');

module.exports = {
  name: 'combine',
  coalesce: true,
  run: function(states, callback, name) {
    var path = states[0].file;
    if (name) {
        path.setFilename(name);
    }
    var contents = states.map((s) => s.contents).join("\n");
    callback({ file: path, contents: contents });
  }
}
