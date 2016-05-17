function ActionGraph(pipeline) {
  this.nodes = [];
  pipeline.files.forEach((f) => {
    var prev = null;
    var first = null;
    pipeline.actions.forEach((a) => {
      var curr = {
        // prev: prev,
        action: a.action,
        args: a.args
      }
      if (prev) {
        prev.next = curr;
      }
      else {
        first = curr;
      }
      prev = curr;
    });
    var node = {
      file: f,
      next: first
    };
    this.nodes.push(node);
  });
}

module.exports = ActionGraph;