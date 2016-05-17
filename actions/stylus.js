var stylus   = require('stylus');

module.exports = {
  name: 'stylus',
  run: function(state, callback, options) {
    state.file.setExtension(options.minify ? '.min.css' : '.css');
    state.contents = stylus.render(state.contents);
    callback(null, state);
  }
}