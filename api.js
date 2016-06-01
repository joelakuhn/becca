var NodeSet    = require('./nodeset.js');
var ActionGraph = require('./action-graph.js');
var Runner      = require('./runner.js');
var Watcher     = require('./watcher.js');
var glob        = require('./glob.js');
var fs          = require('fs');


function becca() {
  var objects = Array.prototype.slice.apply(arguments);
  var new_pipeline = new NodeSet(objects);
  becca.pipelines.push(new_pipeline);
  return new_pipeline;
}

becca.pipelines = [];
becca.tasks = {};


becca.action = function(action) {
  NodeSet.register(action);
}


becca.build = function() {
	var runner = new Runner(becca.pipelines);

	runner.start();

  return runner;
}

becca.watch = function(runner) {
  var watcher = new Watcher(runner);
  watcher.start();
  return watcher;
}

becca.task = function(name, callback, args_config) {
  if (typeof args_config === 'undefined') {
    args_config = {};
  }
  if (typeof name == 'string') name = [name];

  for (var i=0; i<name.length; i++) {
    becca.tasks[name[i]] = {
      callback: callback,
      args_config: args_config,
    };
  }
}

module.exports = global.becca = becca;
