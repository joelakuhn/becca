var CleanCSS = require('clean-css');

module.exports = {
  name: 'clean_css',
  sync: true,
  run: function(state, options) {
    state.file.setExtension('.min.css');
    state.contents = new CleanCSS(options).minify(state.contents).styles;
  }
}
