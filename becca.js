#!/usr/bin/env node

///////// DEPENDENCIES /////////

var fs          = require('fs');
var path        = require('path');
var NodeSet     = require('./nodeset.js');
var becca       = require('./api.js');
var require_all = require('./require-all.js');
var cli         = require('./cli.js');

///////// REGISTER ACTIONS /////////

require_all('actions').forEach(NodeSet.register);

///////// LOAD BUILT IN TASKS /////////

require_all('tasks');

///////// LOAD RULES /////////

if (fs.existsSync('beccaconfig.js')) {
	require(path.join(process.cwd(), 'beccaconfig.js'));
}
else {
	console.error('There is no beccaconfig.js file in this directory.')
	return;
}

///////// REAL WORK /////////

cli();
