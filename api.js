var Pipeline    = require('./pipeline.js');
var ActionGraph = require('./action-graph.js');
var Runner      = require('./runner.js');
var glob        = require('./glob.js');

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

becca.build = function() {
	var graphs = becca.pipelines.map((p) => new ActionGraph(p));

	var runner = new Runner(graphs);

	runner.start();
}

becca.pipelines = [];

module.exports = global.becca = becca;