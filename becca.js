#!/usr/bin/env node

///////// DEPENDENCIES /////////

var fs          = require('fs');
var path        = require('path');
var Pipeline    = require('./pipeline.js');
var becca       = require('./api.js');
var require_all = require('./require-all.js');
var parse_args  = require('./parse-args.js');

///////// REGISTER ACTIONS /////////

require_all('actions').forEach(Pipeline.register);


///////// LOAD RULES /////////

if (fs.existsSync('beccaconfig.js')) {
	require(path.join(process.cwd(), 'beccaconfig.js'));
}
else {
	console.error('There is no beccaconfig.js file in this directory.')
	return;
}

///////// LOAD ARGS /////////

var args = parse_args();


///////// REAL WORK /////////

var command = args[0] || 'build';

if (command == 'build') {
	var runner = becca.build();
}
else if (command == 'watch') {
	var runner = becca.build();
	var watcher = becca.watch(runner);
}
else if (command in becca.tasks) {
	becca.tasks[command](args);
}
else {
	console.error('unknown command ' + command);
}
