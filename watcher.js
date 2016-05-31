var fs = require('fs');

function Watcher(runner) {
	this.runner = runner;
	this.watch_procs = [];
}

Watcher.prototype.start = function() {

	var nodes = [];
	var watch_procs = this.watch_procs;
	var runner = this.runner;

	this.runner.graphs.forEach(function(graph) {
		graph.nodes.forEach(function(node) {
			nodes.push(node);
		});
	});

	nodes.forEach(function(node) {
		var w = fs.watch(node.file, function(arg1, arg2) {
			runner.startNode(node);
		});
		watch_procs.push(w);
	});
}

Watcher.prototype.stop = function() {
	this.watch_procs.forEach(function(w) {
		w.close();
	});
}

Watcher.prototype.add_files = function(files) {
	for (var i=0; i<files.length; i++) {
		this.add_file(files[i]);
	}
}

Watcher.prototype.add_file = function(file) {
	fs.watch(file, function() {
		becca.build();
	});
}

module.exports = Watcher;
