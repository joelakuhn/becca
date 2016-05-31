function cli() {

  var args_parser = require('./args-parser.js');

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

}

module.exports = cli;
