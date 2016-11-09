module.exports = {
  name: 'uglify_js',
  sync: true,
  run: function(state) {
    var uglify = require('uglify-js');
    var minified = uglify.minify(state.contents, { fromString: true });

    state.contents = minified.code;
  },
  path: function(state, args) {
    state.file.setExtension('.min.js');
  }
}
