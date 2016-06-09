///////// DEPENDENCIES /////////

var NodeSet     = require('./nodeset.js');
var becca       = require('./api.js');
var require_all = require('./require-all.js');

///////// REGISTER ACTIONS /////////

require_all('actions').forEach(NodeSet.register);

///////// LOAD BUILT IN TASKS /////////

require_all('tasks');

module.exports = becca;
