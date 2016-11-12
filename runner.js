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
    Runner.runNode(node);
  });
}

function prereqs_met(node, state) {
  return !node.prev || node.prev.reduce((acc, n) => {
    return acc && (n.run || n.skipped);
  }, true);
}

function open_file(node, state, callback) {
  fs.readFile(state.file.path, function(err, contents) {
    state.contents = contents
    callback(err, state);
  });
}

function get_state(node, state, callback) {
  if (node.action.coalesce) {
    callback(null, state = node.prev.map((n) => n.state));
  }
  else if (!('contents' in state)) {
    open_file(node, state, callback);
  }
  else {
    if (node.action.datatype == 'any') {
      callback(null, state);
    }
    else if (node.action.datatype == 'binary') {
      callback(null, state);
    }
    else if (state.contents instanceof Buffer) {
      state.contents = state.contents.toString();
      callback(null, state);
    }
    else {
      callback(null, state);
    }
  }
}

function run_path(node) {
  if (node.action.path) {
    var args = node.args.slice(0);
    args.unshift(node.state);
    node.action.path.apply(node.action.path, args)
  }
}

function run_sync(node, args) {
  args.unshift(node.state);
  var new_state = node.action.run.apply(node.action, args);
  node.run = true;
  run_path(node);
  run_next(node, new_state);
}

function run_async(node, args) {
  args.unshift(function(err, state) {
    if (arguments.length == 1) {
      state = err;
      err = null;
    }
    if (err) { console.log(err); }
    node.run = true;
    run_path(node);
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
  node.is_running = false;
  if (node.next) {
    Runner.runNode(node.next, state || node.state);
  }
}

function is_pipeline_running(node) {
  var nNode = node;
  var pNode = node;

  if (node.is_running) return true;

  while (nNode.next) {
    if (nNode.is_running) return true;
    nNode = nNode.next;
  }

  while (pNode.prev) {
    if (pNode.is_running) return true;
    pNode = pNode.prev;
  }

  return false;
}

function run_missing_prereqs(node) {
  if (node.prev) {
    node.prev.forEach(run_missing_prereqs);
  }
  else {
    if (!is_pipeline_running(node)) {
      Runner.runNode(node);
    }
  }
}

Runner.runNode = function(node, state) {
  if (node.is_running) return;

  if (arguments.length === 1) {
    state = {
      file: new FilePath(node.file)
    }
  }

  var args = node.args.slice();

  if (!prereqs_met(node, state)) {
    run_missing_prereqs(node);
    return;
  }

  node.is_running = true;

  get_state(node, state, function(err, state) {

    if (err) {
      console.log(err);
      return;
    }

    node.state = state;

    try {

      if (state.filtered && !node.action.accept_filtered) {
        skip(node);
      }
      else {
        if (node.action.sync) {
          run_sync(node, args);
        }
        else {
          run_async(node, args);
        }
      }

    }
    catch (err) {
      console.log(err);
    }

  });

}

module.exports = Runner;
