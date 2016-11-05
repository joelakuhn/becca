///////// DEPENDENCIES /////////

var NodeSet       = require('./nodeset.js');
var becca         = require('./api.js');
var require_all   = require('./require-all.js');
var plugin_loader = require('./plugin-loader.js');

///////// REGISTER ACTIONS /////////

require_all('actions').forEach(NodeSet.register);

///////// LOAD BUILT IN TASKS /////////

require_all('tasks');

///////// LOAD LOCAL PLUGINS /////////

plugin_loader.load_plugins();

module.exports = becca;
