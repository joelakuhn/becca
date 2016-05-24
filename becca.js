#!/usr/bin/env node

///////// DEPENDENCIES /////////

var path        = require('path');
var Pipeline    = require('./pipeline.js');
var becca       = require('./api.js');
var require_all = require('./require-all.js');
var parse_args  = require('./parse-args.js');

///////// REGISTER ACTIONS /////////

require_all('actions').forEach(Pipeline.register);


///////// LOAD RULES /////////

require(path.join(process.cwd(), 'beccaconfig.js'));

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
