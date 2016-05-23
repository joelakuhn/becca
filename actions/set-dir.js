module.exports = {
  name: 'set_dir',
  sync: true,
  run: function(state, dir) {
    state.file.setDir(dir);
  }
}
