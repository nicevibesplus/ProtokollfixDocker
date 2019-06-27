var async = require('async'),
  fs      = require('fs-extra'),
  path    = require('path'),
  config  = require('../config');

/**
 * reads the data directories, and passes the result object with filenames to the callback
 */
module.exports = function loadDirectories(callback) {
  var result = { documents: {}, templates: {}, snippets: {}, baseURL: config.baseURL };

  /* reads the contents of a directory, and inserts their paths in a passed object,
     where the property key is the filename, and the value the URIencoded filename
     with a pre- and postfix string */
  function readDir(dir, object, extensionFilter, prefix, postfix, done) {
    fs.readdir(dir, function(err, data) {
      data = data.sort().reverse() // issue #4
      if (err) return done(err);
      for (var i = 0; i < data.length; i++) {
        var fileName = data[i],
          fileExt = path.extname(fileName);

        if (fs.statSync(dir + fileName).isFile() && extensionFilter.indexOf(fileExt) !== -1)
          object[fileName] = prefix + encodeURIComponent(fileName) + postfix;
      }
      done();
    });
  }

  // make sure the data directories exist & get their contents
  async.series([
    async.apply(fs.ensureDir, config.directories.documents),
    async.apply(fs.ensureDir, config.directories.templates),
    async.apply(fs.ensureDir, config.directories.snippets),
    async.apply(readDir, config.directories.documents, result.documents,
      config.listExtensions, config.baseURL + '/document/', ''),
    async.apply(readDir, config.directories.templates, result.templates,
      config.listExtensions, config.baseURL + '/template/', ''),
    async.apply(readDir, config.directories.snippets, result.snippets,
      config.listExtensions, 'protokollfix.insertSnippet("', '")')
  ], function(err) { callback(err, result); });
};
