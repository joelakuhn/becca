var CleanCSS = require('clean-css');

module.exports = {
  name: 'clean_css',
  sync: true,
  run: function(state) {
    state.file.setExtension('.min.css');
    state.contents = new CleanCSS().minify(state.contents).styles;
  }
}