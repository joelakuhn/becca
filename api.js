var Pipeline    = require('./pipeline.js');
var ActionGraph = require('./action-graph.js');
var Runner      = require('./runner.js');
var Watcher     = require('./watcher.js');
var glob        = require('./glob.js');
var fs          = require('fs');

function combine_arguments(args) {
  var files = [];
  for (var i=0; i<args.length; i++) {
    if (typeof args[i] === 'string') {
      glob(args[i]).forEach((f) => files.push(f))
    }
    else if (typeof args[i] === 'object' && 'forEach' in args[i]) {
      args[i].forEach((f) => glob(f).forEach((f) => files.push(f)));
    }
  }
  return files;
}



function becca() {
  var files = combine_arguments(arguments);
  var new_pipeline = new Pipeline(files);
  becca.pipelines.push(new_pipeline);
  return new_pipeline;
}

becca.pipelines = [];
becca.tasks = {};



becca.build = function() {
	var graphs = becca.pipelines.map((p) => new ActionGraph(p));

	var runner = new Runner(graphs);

	runner.start();

  return runner;
}

becca.watch = function(runner) {
  var watcher = new Watcher(runner);
  watcher.start();
  return watcher;
}

becca.task = function(name, callback) {
  if (typeof name == 'string') name = [name];

  for (var i=0; i<name.length; i++) {
    becca.tasks[name[i]] = callback;
  }
}

module.exports = global.becca = becca;
