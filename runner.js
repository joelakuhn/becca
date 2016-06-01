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
  pipeline.files.forEach(function(file) {
    runFile(pipeline, {
      file: new FilePath(file)
    });
  });
}

function runNode(pipeline, state) {
  console.log(pipeline);
}

module.exports = Runner;
