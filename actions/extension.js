module.exports = {
	name: 'extension',
	alias: 'ext',
	sync: true,
	run: function(state, args) { },
	path: function(state, extension) {
		if (extension[0] != '.') {
			extension = '.' + extension;
		}
		state.file.setExtension(extension);
	}
}