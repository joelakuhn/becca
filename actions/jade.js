module.exports = {
  name: 'jade',
  sync: true,

  run: function(state, args) {
    var jade = require('jade');
    state.contents = jade.render(state.contents);
  },
  path: function(state, args) {
    state.file.setExtension('.html');
  }
}