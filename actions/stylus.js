var stylus   = require('stylus');

module.exports = {
  name: 'stylus',
  sync: true,
  run: function(state, callback) {
    state.contents = stylus.render(state.contents);
  },
  path: function(state, args) {
    state.file.setExtension('.css');
  }
}
