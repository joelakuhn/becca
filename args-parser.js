function snakify(arg) {
	return arg.replace(/^-+/, '').replace(/-/g, '_');
}

function parse(def, args) {
	if (!def) {
		def = {};
	}
	if (!args) {
		args = process.argv.slice(2);
	}
	var results = [];
	for (var i=0; i<args.length; i++) {
		var arg = args[i];
		if (arg[0] == '-') {
			if (arg in def && def[arg].alias) {
				arg = def[arg].alias;
			}
			if (arg in def && def[arg].flag) {
				results[def[arg].name] = true;
			}
			else {
				if (args.length > (i + 1)) {
					results[snakify(arg)] = args[i + 1];
					i++;
				}
				else {
					throw arg + ' expected an argment.';
				}
			}
		}
		else {
			results.push(arg);
		}
	}
	return results;
}

function get_command(args) {
	for (var i=0; i<args.length; i++) {
		if (args[i][0] != '-') return args[i];
	}
}

function split_args(args) {
	var argsets = [[]];
	var curr = 0;
	for (var i=0; i<args.length; i++) {
		var arg = args[i];
		if (arg == ',') {
			argsets[++curr] = [];
		}
		else if (arg[arg.length - 1] == ',') {
			argsets[curr].push(arg.substr(0, arg.length - 1))
			argsets[++curr] = [];
		}
		else {
			argsets[curr].push(arg);
		}
	}
	if (argsets[0].length > 0) {
		return argsets;
	}
	else {
		return [];
	}
}

function get_commands(args) {
	if (!args) {
		args = process.argv.slice(2);
	}

	var argsets = split_args(args);
	return argsets.map(function(argset) {
		return {
			command: get_command(argset),
			args: argset.slice(1)
		}
	})
}

module.exports = {
	parse: parse,
	get_commands: get_commands,
}
