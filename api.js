var NodeSet           = require('./nodeset.js');
var Runner            = require('./runner.js');
var Watcher           = require('./watcher.js');
var Task              = require('./task.js');
var Console           = require('./console.js');
var glob              = require('./glob.js');
var fs                = require('fs');
var load_config       = require('./load-config.js');
var do_nothing_action = require('./actions/do-nothing');

function becca() {
  var objects = Array.prototype.slice.apply(arguments);
  var new_pipeline = new NodeSet(objects, do_nothing_action);
  becca.pipelines.push(new_pipeline);
  return new_pipeline;
}

becca.pipelines = [];
becca.tasks = {};

becca.load_config = function() {
  return load_config();
}


becca.action = function(action) {
  NodeSet.register(action);
}


becca.build = function() {
  var runner = new Runner(becca.pipelines);

  runner.start();

  return runner;
}

becca.watch = function() {
  var watcher = new Watcher();
  watcher.add_nodesets(becca.pipelines);
  return watcher;
}

becca.task = function(name, callback, args_spec) {
  if (typeof args_spec === 'undefined') {
    args_spec = {};
  }
  if (typeof name == 'string') name = [name];

  var new_task = new Task(name, callback, args_spec);

  for (var i=0; i<name.length; i++) {
    becca.tasks[name[i]] = new_task;
  }

  return new_task;
}

becca.console = Console;

becca.log = function(log_path) {
  var log_stream = fs.createWriteStream(log_path);
  var bound_log_stream = log_stream.write.bind(log_stream);
  process.stdout.write = bound_log_stream;
  process.stderr.write = bound_log_stream;
}

becca.default = function(task) {
  becca.default_task = task;
}

becca.register = function(action) {
  NodeSet.register(action);
}

module.exports = global.becca = becca;
