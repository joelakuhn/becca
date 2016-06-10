var fs = require('fs');
var Runner = require('./runner.js');
var FilePath = require('./file-path.js');

function Watcher() {
	this.watch_procs = [];
}

Watcher.prototype.add_nodeset = function(nodeset) {
	var watch_procs = this.watch_procs;

	nodeset.nodes.forEach(function(node) {
		if (node.root) {
			var w = fs.watch(node.file, function() {
				run(node);
			});
		}
	});
}

Watcher.prototype.add_nodesets = function(nodesets) {
	nodesets.forEach((nodeset) => {
		this.add_nodeset(nodeset);
	});
}

Watcher.prototype.stop = function() {
	this.watch_procs.forEach(function(w) {
		w.close();
	});
}

function run(node) {
	fs.lstat(node.file, function(err, stats) {
		if (!err) {
			if (!node.mtime || +node.mtime != +stats.mtime) {
				node.mtime = stats.mtime;
				Runner.runNode(node, { file: new FilePath(node.file) });
			}
		}
		else {
			console.log('Watcher could not get modified time for ' + node.file);
		}
	});
}

module.exports = Watcher;
