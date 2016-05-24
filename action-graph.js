function ActionGraph(pipeline) {
  this.nodes = [];
  var coalescants = [];
  pipeline.files.forEach((f) => {
    var prev = null;
    var first = null;
    pipeline.actions.forEach((a, action_n) => {
      var curr;
      if (a.action.coalesce) {
        if (action_n in coalescants) {
          curr = coalescants[action_n];
          curr.count++;
        }
        else {
          curr = coalescants[action_n] = {
            action: a.action,
            args: a.args,
            count: 1,
            received: 0,
            states: {}
          }
        }
      }
      else {
        curr = {
          action: a.action,
          args: a.args
        }
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