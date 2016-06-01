var stylus   = require('stylus');

module.exports = {
  name: 'stylus',
  run: function(state, callback) {
    state.contents = stylus.render(state.contents);
    callback(null, state);
  },
  path: function(state, args) {
    state.file.setExtension('.css');
  }
}
