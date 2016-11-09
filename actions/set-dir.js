module.exports = {
  name:     'set_dir',
  sync:     true,
  datatype: 'any',

  run: function(state, dir) { },
  path: function(state, args) {
    state.file.setDir(dir);
  }
}
