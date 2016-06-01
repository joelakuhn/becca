module.exports = {
  name: 'set_dir',
  sync: true,
  run: function(state, dir) { },
  path: function(state, args) {
    state.file.setDir(dir);
  }
}
