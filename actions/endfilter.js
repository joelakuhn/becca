module.exports = {
  name:            'endfilter',
  sync:            true,
  datatype:        'any',
  accept_filtered: true,
  run: function(state) {
    if (state.filtered) {
      state.filtered = state.filtered - 1;
    }
  }
}