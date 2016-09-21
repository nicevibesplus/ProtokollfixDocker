var bodyParser = require('body-parser'),
  compression = require('compression'),
  debug       = require('debug')('main'),
  express     = require('express'),
  fs          = require('fs'),
  https       = require('https');

var auth      = require('./lib/auth')(),
  config      = require('./config'),
  routesAPI   = require('./lib/routesAPI'),
  routesFront = require('./lib/routesFrontend'),
  loadDirectories = require('./lib/loadDirectories');

var webserver = express();

/* SSL Integration, if enabled in config. must be run before any route */
if (config.https.enabled) {
  https.createServer({
    key:  fs.readFileSync(config.https.keyPath),
    cert: fs.readFileSync(config.https.certPath),
    ca:   config.https.caPath ? fs.readFileSync(config.https.caPath) : undefined
  }, webserver).listen(config.https.port);

  /* Redirect all traffic over SSL */
  webserver.set('port_https', config.https.port);
  webserver.all('*', function(req, res, next){
    if (req.secure) return next();
    res.redirect("https://" + req.hostname + ":" + config.https.port + req.url);
  });
  debug('https server now listening on port ' + config.https.port);
}

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
