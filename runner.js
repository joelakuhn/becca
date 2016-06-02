var fs = require('fs');

var FilePath = require('./file-path.js');

function Runner(pipelines) {
  this.pipelines = pipelines
}

Runner.prototype.start = function() {
  this.pipelines.forEach(function(pipeline) {
    runPipeline(pipeline);
  });
}

function runPipeline(pipeline) {
  pipeline.nodes.forEach(function(node) {
    Runner.runNode(node, {
      file: new FilePath(node.file)
    });
  });
}

Runner.runNode = function(node, state) {
  var args = node.args.slice();

  if (node.action.coalesce) {
    if (node.prev && !node.prev.reduce((acc, n) => {
      return acc && n.run
    }, true)) {
      return;
    }
    state = node.prev.map((n) => n.state);
  }

  node.state = state;

  if (node.action.path) {
    args.unshift(state);
    node.action.path.apply(node.action.path, args)
  }

  try {
    if (node.action.sync) {
      args.unshift(state);
      node.action.run.apply(node.action, args);
      node.run = true;
      if (node.next) {
        Runner.runNode(node.next, state);
      }
    }
    else {
      args.unshift(function(e, state) {
        if (e) { console.log(e) }
        node.run = true;
        if (node.next) {
          Runner.runNode(node.next, state);
        }
      });
      args.unshift(state);
      node.action.run.apply(node.action, args);
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = Runner;
