var stylus   = require('stylus');

module.exports = {
  name: 'stylus',
  run: function(state, callback) {
    state.contents = stylus.render(state.contents);
    state.file.setExtension('.css');
    callback(null, state);
  }
}
