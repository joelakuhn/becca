var cmm = require('css-media-merge');

module.exports = {
  name: 'css_media_merge',
  sync: true,
  run: function(state, options) {
  	state.contents = cmm.merge(state.contents, options);
  }
}
