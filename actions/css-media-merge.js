module.exports = {
  name: 'css_media_merge',
  sync: true,
  run: function(state, options) {
    var cmm = require('css-media-merge');
  	state.contents = cmm.merge(state.contents, options);
  }
}
