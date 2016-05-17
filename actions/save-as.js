module.exports = {
  name: 'save_as',
  sync: true,
  run: function(state, p) {
    state.file.path = p;
  }
}