var fs = require('fs');
var fspath = require('path');

var dircache = null;
var regex_cache = [];
var new_file_callbacks = [];
var watching_for_new_files = false;

function find(path, arr, type) {
	var stats = fs.lstatSync(path);
	if (stats.isDirectory()) {
		var paths = fs.readdirSync(path);
		arr.push({ type: 'd', path: path });
		paths.forEach((p) => find(path + fspath.sep + p, arr))
	}
	else {
		arr.push({ type: 'f', path: path });
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

function expand_glob(glob, type) {
	if (typeof type === 'undefined') {
		type = 'f';
	}
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

	return dircache
	.filter((f) => f.type === type)
	.map((f) => f.path)
	.filter((f) => glob_regex.test(f));
}

function in_dircache(path) {
	if (!dircache) dircache = find('.', []);

	var found_file = dircache.filter((f) => f.path === path);
	return found_file.length > 0;
}

function remove_from_cache(path) {
	for (var i=0; i<dircache.length; i++) {
		if (dircache[i].path == path) {
			dircache.splice(i, 1);
			break;
		}
	}
}

function watch_for_changes() {
	if (watching_for_new_files) return;

	watching_for_new_files = true;
	var directories = expand_glob('**', 'd');
	directories.forEach((dir) => {
		fs.watch(dir, (event_type, filename) => {
			if (event_type === 'change') return;
			var path = dir + '/' + filename;

			if (!in_dircache(path)) {
				dircache.push({ type: 'f', path: path });
				new_file_callbacks.forEach((cb) => {
					if (test_glob(path, cb.glob)) {
						cb.callback(path);
					}
				});
			}
			else {
				remove_from_cache(path);
			}
		});
	});
}

function on_new_file(glob, callback) {
	var directories = expand_glob('**', 'd');
	watch_for_changes();
	new_file_callbacks.push({ glob: glob, callback: callback });
}

function test_glob(path, glob) {
	var glob_regex = make_glob_regex('.', glob);
	return glob_regex.test(path);
}

expand_glob.test = test_glob;
expand_glob.on_new_file = on_new_file;
module.exports = expand_glob;
