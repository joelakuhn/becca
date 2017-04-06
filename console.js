function print_date() {
  var now = new Date();
  process.stdout.write(
    '[' +
    now.getMonth() +
    '/' +
    now.getDay() +
    '/' +
    now.getYear() +
    ' ' +
    now.getHours() +
    ':' +
    now.getMinutes() +
    ':' +
    now.getSeconds() +
    "]  "
  );
}

var Console = {
  log: function() {
    print_date();
    console.log.apply(null, arguments);
  },

  err: function() {
    print_date();
    console.err.apply(null, arguments);
  }
};

module.exports = Console;
