var bodyParser = require('body-parser'),
  compression = require('compression'),
  debug       = require('debug')('main'),
  express     = require('express');

var auth      = require('./lib/auth')(),
  config      = require('./config'),
  routesAPI   = require('./lib/routesAPI'),
  routesFront = require('./lib/routesFrontend'),
  loadDirectories = require('./lib/loadDirectories');

var webserver = express();

/* authentication for all requests. POST /save is handled seperately */
if (config.auth.enabled && !config.auth.saveOnly) webserver.use(auth);

/* express config */
webserver.set('view engine', 'pug');
webserver.use(compression());
webserver.use(bodyParser.urlencoded({ extended: true }));
webserver.use(config.baseURL, express.static('static'));

webserver.use(config.baseURL, routesFront);
webserver.use(config.baseURL + '/api', routesAPI);

webserver.use(function(req, res, next) {
  debug(['Served', req.method, req.originalUrl, 'to', req.ip].join(' '));
  next();
});

// finally start the server
loadDirectories(function(err, result) {
  if (err) return debug('unable to retrieve directory contents: ' + err);
  webserver.locals = result;
  var server = webserver.listen(config.httpPort, function() {
    debug('webserver running on port ' + server.address().port);
  });
});
