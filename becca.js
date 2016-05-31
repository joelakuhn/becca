#!/usr/bin/env node

///////// DEPENDENCIES /////////

var fs          = require('fs');
var path        = require('path');
var Pipeline    = require('./pipeline.js');
var becca       = require('./api.js');
var require_all = require('./require-all.js');
var args_parser = require('./args-parser.js');

///////// REGISTER ACTIONS /////////

require_all('actions').forEach(Pipeline.register);

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

var command = args_parser.get_command() || 'build';

if (command in becca.tasks) {
  var task = becca.tasks[command];
  var args = args_parser.parse(task.args_config);
  args.shift();
	task.callback(args);
}
else {
	console.error('unknown command: ', command);
}
