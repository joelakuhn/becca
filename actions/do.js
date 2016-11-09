module.exports = {
  name:     'do',
  datatype: 'any',

  run: function(state, callback, do_function) {
    do_function(state, function(err, state) {
      if (arguments.length === 1) {
        state = err;
        err = null;
      }
      callback(err, state);
    });
  }
}