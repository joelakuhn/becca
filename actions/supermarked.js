module.exports = {
  name: 'supermarked',
  sync: true,
  run: function(state) {
    var sm = require('supermarked');
    state.contents = sm(state.contents, { sanitize: false });
  },
  path: function(state, args) {
    state.file.setExtension('.html');
  }
}