module.exports = {
  name:     'set_root_dir',
  sync:     true,
  datatype: 'any',

  run: function() { },
  path: function(state, root_dir) {
    var path = require('path');
    state.file.setDir(path.join(root_dir, state.file.dir()));
  }
}