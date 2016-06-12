var fs = require('fs');
var fspath = require('path');

var dircache = null;
var regex_cache = [];

function find(path, arr) {
	var stats = fs.lstatSync(path);
	if (stats.isDirectory()) {
		var paths = fs.readdirSync(path);
		paths.forEach((p) => find(path + fspath.sep + p, arr))
	}
	else {
		arr.push(path);
	}
	return arr;
}

function make_glob_regex(wd, glob) {
	if (regex_cache[glob]) {
		return regex_cache[glob]
	}
	glob_regex_str = (wd + fspath.sep + glob).replace(/(?!\\)(\*+)/g, function(match) {
		if (match == '**') {
			return '.*';
		}
		else {
			return '[^\\' + fspath.sep + ']*';
		}
	});
	return regex_cache[glob] = new RegExp('^' + glob_regex_str + '$');
}

function expand_glob(glob) {
	if (!glob.match(/(?!\\)(\*+)/)) {
		if (fs.existsSync(glob)) {
			return [glob];
		}
		return [];
	}
	if (!dircache) {
		dircache = find('.', []);
	}
	var glob_regex = make_glob_regex('.', glob);
	return dircache.filter((f) => glob_regex.test(f));
}

expand_glob.test = function(path, glob) {
	var glob_regex = make_glob_regex('.', glob);
	return glob_regex.test(path);
}

module.exports = expand_glob
