module.exports = {
  name:     'encoding',
  sync:     true,
  datatype: 'any',

  run: function(state, encoding) {
    if (state.contents instanceof String) {
      throw "The encoding action was given a string rather than binary data.\n"
      + "This action was called in a pipeline for '" + state.file.path + "'.";
    }
    else {
      state.contents = state.contents.toString(encoding);
    }
    return state;
  }
}
