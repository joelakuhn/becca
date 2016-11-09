module.exports = {
  name:     'execute',
  datatype: 'any',
  alias:    [ 'bin', 'exe' ],

  run: function(state, callback, command, args) {
    var spawn = require('child_process').spawn;
    console.log(command + ' ' + args.join(' '));
    var proc = spawn(command, args);
    var data_chunks = [];
    var error_chunks = [];

    proc.stdout.on('data', function(data) {
      data_chunks.push(data);
    });

    proc.stderr.on('data', function(data) {
      error_chunks.push(data);
    });

    proc.on('close', (code) => {
      if (code === 0) {
        state.contents = Buffer.concat(data_chunks);
        callback(null, state);
      }
      else {
        callback(Buffer.concat(error_chunks).toString(), state);
      }
    });

    proc.stdin.write(state.contents);
    proc.stdin.end();
  }
}