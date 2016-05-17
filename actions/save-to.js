module.exports = {
  name: 'save_to',
  sync: true,
  run: function(state, dir) {
    state.file.setDir(dir);
  }
}