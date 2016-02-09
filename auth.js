var config = require('./config.js'),
  fs       = require('fs'),
  httpAuth = require('http-auth');

module.exports = function() {
  // check if authentication is enabled
  if (config.auth.enabled && config.auth.type === 'basic') {
    var keyfileAvailable, basic;
    
    // check if a keyfile is available. if not, use the credentials from config file
    if (config.auth.basic_keyfile)
      keyfileAvailable = fs.statSync(config.auth.basic_keyfile).isFile();
    
    function basicConfigCredentials(username, password, cb) {
      cb(username === config.auth.basic_user && password === config.auth.basic_pw);
    }
    
    basic = httpAuth.basic({
      realm: 'LSMT - Editor',
      file: config.auth.basic_keyfile
    }, keyfileAvailable ? undefined : basicConfigCredentials);
    
    return httpAuth.connect(basic);
  }
  // if no authentication is required, return an empty middleware function,
  // to provide a consistent API
  else {
    return function(req, res, next) { next(); };
  }
};
