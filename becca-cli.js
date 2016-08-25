#!/usr/bin/env node

var becca = require('./becca.js');
var args_parser = require('./args-parser.js');

function load_config() {
	if (becca.load_config()) {
		return true;
	}
	else {
		console.warn('Could not read beccaconfig.js file.');
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
	    task.run(command.args);
	  }
	  else {
	    console.error('unknown command: ', command.command);
	  }
	})
}

load_config();
var commands = get_commands();
run_commands(commands);
