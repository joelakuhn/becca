var args_parser = require('./args-parser.js');

function Task(name, callback, args_spec) {
  this.name      = name;
  this.callback  = callback;
  this.args_spec = args_spec;
}

Task.prototype.run = function(args) {
  if (args instanceof Array) {
    args = args_parser.parse(this.args_spec, args);
  }
  this.callback(args);
}

module.exports = Task;
