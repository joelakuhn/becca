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

function runNode(node, state) {
  var args = node.args.slice();

  if (node.action.coalesce) {
    node.received++;
    node.states[state.file.path] = state;
    if (node.received < node.count) {
      return;
    }
    else {
      state = [];
      for (var file in node.states) {
        if (node.states.propertyIsEnumerable(file)) {
          state.push(node.states[file]);
        }
      }
    }
  }
  if (node.action.sync) {
    args.unshift(state);
    node.action.run.apply(node.action, args);
    if (node.next) {
      runNode(node.next, state);
    }
  }
  else {
    args.unshift(function(e, state) {
      if (node.next) {
        runNode(node.next, state);
      }
    });
    args.unshift(state);
    node.action.run.apply(node.action, args);
  }
}

module.exports = Runner;
