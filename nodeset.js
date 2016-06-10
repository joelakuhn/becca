var glob = require('./glob.js');
var Runner = require('./runner.js');
var Watcher = require('./watcher.js');

function expand_selectors(args) {
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

function create_coalesce_node(objects, action, args) {
  var node = {
    root: false,
    file: '',
    action: action,
    args: args || [],
    prev: objects
  }
  objects.forEach(function(object) {
    object.next = node;
  });
  return node;
}

function create_nodes(objects, action, args) {
  var nodes = objects.map(function(object) {
    var root = typeof object.file === 'undefined';
    var new_node = {
      file: root ? object : object.file,
      action: action,
      args: args || [],
      prev: root ? null : [ object ],
      root: root
    }
    if (typeof object !== 'string') object.next = new_node;
    return new_node;
  });
  return nodes;
}

function CheckObjects(objects, selectors) {

  var path_objects = objects.filter(function(object) {
    return typeof object == 'string';
  });

  var path_selectors = selectors.filter(function(selector) {
    return typeof selector == 'string';
  });

  if (path_objects.length == 0 && path_selectors.length > 0) {
    console.log('You have a selector that did not match any files.');
    console.log(path_selectors);
  }


}

function NodeSet(objects, action, args) {
  var expanded_objects = expand_selectors(objects);
  CheckObjects(expanded_objects, objects);
  if (action.coalesce) {
    this.nodes = [ create_coalesce_node(expanded_objects, action, args) ];
  }
  else {
    this.nodes = create_nodes(expanded_objects, action, args);
  }

  this.prev = [];
  this.watched_files = [];

  objects.forEach((object) => {
    if (object instanceof NodeSet) {
      this.prev.push(object);
      object.next = this;
    }
  });
}

NodeSet.prototype.getRoot = function() {
  var curr = this;
  while (curr.prev.length) {
    // TODO: Currently all nodes only have one ancestor. If this changes, this will need to be reworked.
    curr = curr.prev[0];
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
  var root = this.getRoot();
  var runner = new Runner(root);
  runner.start();
  return this;
}

NodeSet.prototype.watch = function() {
  var root = this.getRoot();
  var watcher = new Watcher();
  watcher.add_nodesets(root);
  return this;
}

NodeSet.prototype.add_watch = function() {
  var files = expand_selectors(arguments)
  var root = this.getRoot();
  for (var i=0; i<files.length; i++) {
    root.watched_files.push(files[i]);
  }
  return this;
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
