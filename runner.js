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
    runNode(node, {
      file: new FilePath(node.file)
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
