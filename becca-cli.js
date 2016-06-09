#!/usr/bin/env node

var becca = require('./becca.js');
var args_parser = require('./args-parser.js');

function load_config() {
	if (becca.load_config()) {
		return true;
	}
	else {
		console.error('Could not read beccaconfig.js file.');
		return false;
	}
}

function get_commands() {
	var commands = args_parser.get_commands();
	if (commands.length == 0) {
	  commands = [ { command: 'build' } ];
	}
	return commands;
}

function run_commands(commands) {
	commands.forEach(function(command) {
	  if (command.command in becca.tasks) {
	    var task = becca.tasks[command.command];
	    var args = args_parser.parse(task.args_config, command.args);
	    task.callback(args);
	  }
	  else {
	    console.error('unknown command: ', command.command);
	  }
	})
}

if (load_config()) {
	var commands = get_commands();
	run_commands(commands);
}
