var stylus   = require('stylus');

module.exports = {
  name: 'stylus',
  sync: true,
  run: function(state, callback, options) {
    if (!options) options = {};
    options.paths = [ state.file.dir() ];
    state.contents = stylus.render(state.contents, options);
  },
  path: function(state, args) {
    state.file.setExtension('.css');
  }
}
