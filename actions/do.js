module.exports = {
	name: 'do',
	run: function(state, callback, do_function) {
		do_function(state, function(err, state) {
			callback(err, state);
		});
	}
}