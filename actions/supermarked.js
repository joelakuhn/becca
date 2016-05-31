module.exports = {
  name: 'supermarked',
  sync: true,
  run: function(state) {
    var sm = require('supermarked');
    state.file.setExtension('.html');
    state.contents = sm(state.contents, { sanitize: false });
  }
}