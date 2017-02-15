module.exports = {
    name: 'gzip',
    datatype: 'any',
    run: function(state, callback, level) {
        if (!level) level = 6;
        var zlib = require('zlib');
        zlib.gzip(state.contents, { level: level }, function(err, buffer) {
            if (err) {
                callback(err);
            }
            else {
                state.contents = buffer
                callback(null, state);
            }
        })
    },
    path: function(state) {
        state.file.path += '.gz';
    }
};
