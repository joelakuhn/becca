module.exports = {
  name: 'stylus',
  run: function(state, callback, options) {
    var stylus   = require('stylus');

    if (!options) options = {};

    options.paths = [ state.file.dir() ];

    stylus.render(state.contents, options, function(err, css) {
      if (err) {
        callback(err);
      }
      else {
        state.contents = css;
        callback(state);
      }
    });

  },
  path: function(state, args) {
    state.file.setExtension('.css');
  }
}
