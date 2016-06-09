#!/usr/bin/env node

var fs    = require('fs');
var path  = require('path');
var becca = require('./becca.js');
var cli   = require('./cli.js');


///////// LOAD RULES /////////

if (fs.existsSync('beccaconfig.js')) {
	require(path.join(process.cwd(), 'beccaconfig.js'));
}
else {
	console.error('There is no beccaconfig.js file in this directory.')
	return;
}


cli();