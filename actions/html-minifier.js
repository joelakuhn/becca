module.exports = {
  name: 'html_minifier',
  sync: true,

  run: function(state, config) {
    if (!config) {
      config = {};
    }
    var htmlmin = require('html-minifier');
    state.contents = htmlmin.minify(state.contents, config);
  }
}
