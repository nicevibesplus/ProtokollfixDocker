var fs = require('fs'),
  sanitize = require('sanitize-filename'),
  config = require('../config'),
  router = require('express').Router();

router.get('/', function (req,res) {
  // Render the Frontpage via Jade aka pug.
  res.render('index', { markdown: config.welcomeText });
});

/* serve the page with a document loaded */
router.get('/document/:file', function (req, res) {
  var locals = {
    file: encodeURIComponent(req.params.file),
    exportFormats: {}
  };

  for (var format in config.exportFormats)
    locals.exportFormats[format] = config.baseURL + '/api/export/' + format + '/' + locals.file;

  // get the file contents
  var filePath = config.directories.documents + sanitize(req.params.file);
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) return res.status(404).end('could not retrieve document!');
    locals.markdown = data;

    // Render the Frontpage via Jade.
    res.render('index', locals);
  });
});

/* serve the page with a template loaded */
router.get('/template/:file', function (req, res) {
  // get the file contents
  var filePath = config.directories.templates + sanitize(req.params.file);
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) return res.status(404).end('could not retrieve template!');

    // Render the page via Jade including the markdown data.
    res.render('index', { markdown: data });
  });
});

module.exports = router;
