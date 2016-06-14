module.exports = {
	name: 'sass',
	run: function(state, callback, options) {
		var sass = require('node-sass');

		if (!options) options = {};
		options.data = state.contents;
		options.file = state.file.path;
		options.indentedSyntax = state.file.extension() == '.sass';

		sass.render(options, function(err, result) {
			if (err) {
				callback(err, state);
			}
			else {
				state.contents = result.css.toString();
				callback(null, state);
			}
		});

	},
	path: function(state) {
		state.file.setExtension('.css');
	}
}
