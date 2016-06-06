var config = require('./config.js'),
  fs       = require('fs'),
  httpAuth = require('http-auth');

module.exports = function() {
  // check if authentication is enabled
  if (config.auth.enabled) {
    var keyfileAvailable, basic;

    // check if a keyfile is available. if not, use the credentials from config file
    if (config.auth.basic.keyfile)
      keyfileAvailable = fs.statSync(config.auth.basic.keyfile).isFile();

    basic = httpAuth.basic({
      realm: config.auth.basic.realm_name || 'Protokollfix - Editor',
      file: config.auth.basic.keyfile
    }, keyfileAvailable ? undefined : basicConfigCredentials);

    function basicConfigCredentials(username, password, cb) {
      cb(username === config.auth.basic.user && password === config.auth.basic.pw);
    }

    return httpAuth.connect(basic);
  }

  // if no authentication is required, return an empty middleware function,
  // to provide a consistent API
  else {
    return function(req, res, next) { next(); };
  }
};
