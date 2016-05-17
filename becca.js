#!/usr/bin/env node

///////// DEPENDENCIES /////////

var path        = require('path');
var Pipeline    = require('./pipeline.js');
var becca       = require('./api.js');
var require_all = require('./require-all.js');

///////// REGISTER ACTIONS /////////

require_all('actions').forEach(Pipeline.register);


///////// LOAD RULES /////////

require(path.join(process.cwd(), 'beccaconfig.js'));


///////// REAL WORK /////////

becca.build();
