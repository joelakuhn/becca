var fs = require('fs');

var FilePath = require('./file-path.js');

function Runner(graphs) {
  this.graphs = graphs;
}

Runner.prototype.start = function() {
  this.graphs.forEach((g) => {
    this.startGraph(g);
  });
}

Runner.prototype.startGraph = function(g) {
  g.nodes.forEach((n) => {
    this.startNode(n);
  });
}

Runner.prototype.startNode = function(n) {
  fs.readFile(n.file, (err, contents) => {
    if (err) {
      throw err.message;
    }
    runNode(n.next, {
      file: new FilePath(n.file),
      contents: contents.toString()
    });
  });
}

function runNode(n, state) {
  var args = n.args.slice();

  if (n.action.sync) {
    args.unshift(state);
    n.action.run.apply(n.action, args);
    runNode(n.next, state);
  }
  else {
    args.unshift(function(e, state) {
      if (n.next) {
        runNode(n.next, state);
      }
    });
    args.unshift(state);
    n.action.run.apply(n.action, args);
  }
}

module.exports = Runner;
