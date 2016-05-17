var fs = require('fs');
var path = require('path');

module.exports = function(dir) {
	var base_dir = path.join(__dirname, dir);
	var file_names = fs.readdirSync(path.join(base_dir));
	return file_names.map(function(file_name) {
		return require(path.join(base_dir, file_name));
	});
}
