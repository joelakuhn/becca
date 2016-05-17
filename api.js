var Pipeline = require('./pipeline.js');
var ActionGraph = require('./action-graph.js');
var Runner      = require('./runner.js');

function becca(files) {
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