function cli() {

  var args_parser = require('./args-parser.js');

  var commands = args_parser.get_commands();
  if (commands.length == 0) {
    commands = [ { command: 'build' } ];
  }

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

module.exports = cli;
