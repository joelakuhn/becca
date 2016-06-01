var glob = require('./glob.js');

function expand_objects(args) {
  var objects = [];
  for (var i=0; i<args.length; i++) {
    if (typeof args[i] === 'string') {
      glob(args[i]).forEach((f) => objects.push(f))
    }
    else if (typeof args[i] === 'object' && 'forEach' in args[i]) {
      args[i].forEach((f) => glob(f).forEach((f) => objects.push(f)));
    }
    else if (args[i] instanceof NodeSet) {
      args[i].nodes.forEach(function(node) {
        objects.push(node);
      });
    }
  }
  return objects;
}

function NodeSet(objects, action) {
  var expanded_objects = expand_objects(objects);
  this.nodes = expanded_objects.map(function(object) {
    var new_node = {
      file: object.file ? object.file : object,
      action: action,
      args: Array.prototype.slice.apply(arguments),
      prev: object.file ? object : null
    }
    if (object.file) object.next = new_node;
    return new_node;
  });
}

NodeSet.register = function(action) {
  NodeSet.prototype[action.name] = (function(action) {
    return function() {
      var new_nodeset = new NodeSet([this], action);
      return new_nodeset;
    }
  })(action);
}

module.exports = NodeSet;