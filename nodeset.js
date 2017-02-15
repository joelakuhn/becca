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

function create_node(object, action, args, nodeset) {
  var root = typeof object.file === 'undefined';
  var new_node = {
    file    : root ? object : object.file,
    action  : action,
    args    : args || [],
    prev    : root ? null   : [ object ],
    root    : root,
    nodeset : nodeset
  }
  if (typeof object !== 'string') object.next = new_node;
  return new_node;
}

function create_nodes(objects, action, args, nodeset) {
  var nodes = objects.map(function(object) {
    return create_node(object, action, args, nodeset);
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

function NodeSet(selectors, action, args) {
  this.action = action;
  this.args = args;
  this.selectors = selectors;
  this.prev = [];
  this.watched_files = [];

  var objects = expand_selectors(selectors);
  CheckObjects(objects, selectors);
  if (action.coalesce) {
    this.nodes = [ create_coalesce_node(objects, action, args) ];
  }
  else {
    this.nodes = create_nodes(objects, action, args, this);
  }

  selectors.forEach((object) => {
    if (object instanceof NodeSet) {
      this.prev.push(object);
      object.next = this;
    }
  });
}

NodeSet.prototype.add_node = function(object) {
  var new_node = create_node(object, this.action, this.args, this);
  this.nodes.push(new_node);
  if (this.next) {
    this.next.add_node(new_node);
  }
  return new_node;
}

NodeSet.prototype.remove_node = function(node) {
  for (var i=0; i<this.nodes.length; i++) {
    if (this.nodes[i] === node) {
      this.nodes.splice(i, 1);
      if (node.next) {
        node.next.nodeset.remove_node(node.next);
      }
    }
  }
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
    if (root.watched_files.indexOf(files[i]) < 0) {
      root.watched_files.push(files[i]);
    }
  }
  return this;
}

NodeSet.prototype.name = function(name) {
  var nodeset = this;
  becca.task(name, function() {
    nodeset.build();
  });
  return this;
}

NodeSet.register = function(action) {
  var new_nodeset = (function(action) {
    return function() {
      var args = Array.prototype.slice.apply(arguments);
      var new_nodeset = new NodeSet([this], action, args);
      return new_nodeset;
    }
  })(action);
  NodeSet.prototype[action.name] = new_nodeset;
  if (action.alias) {
    if (action.alias.length) {
      for (var i=0; i<action.alias.length; i++) {
        NodeSet.prototype[action.alias[i]] = new_nodeset;
      }
    }
    if (typeof action.alias === 'string') {
      NodeSet.prototype[action.alias] = new_nodeset;
    }
  }
}

module.exports = NodeSet;
