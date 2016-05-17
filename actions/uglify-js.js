module.exports = {
  name: 'uglify_js',
  run: function(state, callback) {
    state.file.setExtension('.min.js');
    callback(null, state);
  }
}