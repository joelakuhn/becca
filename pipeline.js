function Pipeline(files) {
  this.actions = [];
  this.files = files;
}

Pipeline.register = function(action) {
  Pipeline.prototype[action.name] = (function(action) {
    return function() {
      this.actions.push({
        action: action,
        args: Array.prototype.slice.apply(arguments)
      });
      return this;
    }
  })(action);
}

module.exports = Pipeline;