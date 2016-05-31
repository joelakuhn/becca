module.exports = {
  name: 'clean_css',
  sync: true,
  run: function(state, options) {
    var CleanCSS = require('clean-css');

    state.file.setExtension('.min.css');
    state.contents = new CleanCSS(options).minify(state.contents).styles;
  }
}
