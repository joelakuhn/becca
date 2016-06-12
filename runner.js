var fs = require('fs');

var FilePath = require('./file-path.js');

function Runner(pipelines) {
  if (!pipelines.forEach) {
    pipelines = [pipelines];
  }
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

function prereqs_met(node, state) {
  return !node.prev || node.prev.reduce((acc, n) => {
    return acc && (n.run || n.skipped);
  }, true);
}

function get_state(node, state) {
  if (node.action.coalesce) {
    return state = node.prev.map((n) => n.state);
  }
  else {
    return state;
  }
}

function run_path(node, args) {
  if (node.action.path) {
    args.unshift(node.state);
    node.action.path.apply(node.action.path, args)
  }
}

function run_sync(node, args) {
  args.unshift(node.state);
  var new_state = node.action.run.apply(node.action, args);
  node.run = true;
  run_next(node, new_state);
}

function run_async(node, args) {
  args.unshift(function(e, state) {
    if (e) { console.log(e); }
    node.run = true;
    run_next(node, state);
  });
  args.unshift(node.state);
  node.action.run.apply(node.action, args);
}

function skip(node) {
  node.skipped = true;
  run_next(node);
}

function run_next(node, state) {
  if (node.next) {
    Runner.runNode(node.next, state || node.state);
  }
}

Runner.runNode = function(node, state) {
  var args = node.args.slice();

  if (!prereqs_met(node, state)) return;

  node.state = get_state(node, state);

  try {

    if (state.filtered && !node.action.accept_filtered) {
      skip(node);
    }
    else {
      run_path(node, args);

      if (node.action.sync) {
        run_sync(node, args);
      }
      else {
        run_async(node, args);
      }
    }

  } catch (e) {
    console.log(e);
  }
}

module.exports = Runner;
