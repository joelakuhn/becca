function snakify(arg) {
	return arg.replace(/^-+/, '').replace(/-/g, '_');
}

function parse_args(def, args) {
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

module.exports = parse_args;
