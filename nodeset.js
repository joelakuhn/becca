var glob = require('./glob.js');
var Runner = require('./runner.js');
var Watcher = require('./watcher.js');

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

function NodeSet(objects, action, args) {
  var expanded_objects = expand_objects(objects);
  if (action.coalesce) {
    var node = {
      root: false,
      file: '',
      action: action,
      args: args || [],
      prev: expanded_objects
    }
    expanded_objects.forEach(function(object) {
      object.next = node;
    });
    this.nodes = [ node ];
  }
  else {
    this.nodes = expanded_objects.map(function(object) {
      var root = typeof object.file === 'undefined';
      var new_node = {
        file: root ? object : object.file,
        action: action,
        args: args || [],
        prev: root ? null : [ object ],
        root: root
      }
      if (!root) object.next = new_node;
      return new_node;
    });
  }

  if (objects.length == 1 && objects[0] instanceof NodeSet) {
    this.prev = objects[0];
    objects[0].next = this;
  }
}

NodeSet.prototype.getFirst = function() {
  var curr = this;
  while (curr.prev) {
    curr = curr.prev;
  }
  return curr;
}

NodeSet.prototype.getLast = function() {
  var curr = this;
  while (curr.next) {
    curr = curr.next;
  }
  return curr;
}

NodeSet.prototype.build = function() {
  var first = this.getFirst();
  var runner = new Runner(first);
  runner.start();
  return runner;
}

NodeSet.prototype.watch = function() {
  var first = this.getFirst();
  var watcher = new Watcher();
  watcher.add_nodeset(first);
  return watcher;
}

NodeSet.register = function(action) {
  NodeSet.prototype[action.name] = (function(action) {
    return function() {
      var args = Array.prototype.slice.apply(arguments);
      var new_nodeset = new NodeSet([this], action, args);
      return new_nodeset;
    }
  })(action);
}

module.exports = NodeSet;
