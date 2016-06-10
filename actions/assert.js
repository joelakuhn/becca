module.exports = {
	name: 'assert',
	run: function(state, callback, condition) {
		if (condition(state)) {
			callback(null, state);
		}
		else {
			console.log('Assertion failed. Stopping Pipeline.');
		}
	}
}