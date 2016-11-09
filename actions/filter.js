module.exports = {
  name:            'filter',
  sync:            true,
  datatype:        'any',
  accept_filtered: true,
  run: function(state, comparer) {
    var glob = require('../glob.js')
    var is_filtered;

    if (state.filtered) {
      is_filtered = true;
    }
    else if (typeof comparer == 'function') {
      is_filtered = !comparer(state);
    }
    else if (typeof comparer == 'string') {
      is_filtered = !glob.test(state.file.path, comparer);
    }
    else if (comparer instanceof RegExp) {
      is_filtered = !comparer.test(state.file.path);
    }
    else {
      throw 'BAD_FILTER: pipeline filters must be a function, glob, or regex';
    }

    if (is_filtered) {
      state.filtered = ('filtered' in state) ? state.filtered + 1 : 1;
    }
  }
}