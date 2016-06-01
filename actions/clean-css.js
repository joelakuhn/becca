module.exports = {
  name: 'clean_css',
  sync: true,
  run: function(state, options) {
    var CleanCSS = require('clean-css');

    state.contents = new CleanCSS(options).minify(state.contents).styles;
  },

  path: function(state, args) {
    state.file.setExtension('.min.css');
  }
}
