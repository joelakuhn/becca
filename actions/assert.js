module.exports = {
  name: 'assert',
  datatype: 'any',

  run: function(state, callback, condition) {
    if (condition(state)) {
      callback(state);
    }
    else {
      becca.console.log('Assertion failed. Stopping Pipeline.');
    }
  }
}