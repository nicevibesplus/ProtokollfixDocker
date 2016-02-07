var async     = require('async'),
  bodyParser  = require('body-parser'),
  compression = require('compression'),
  config      = require('./config.js'),
  debug       = require('debug')('main'),
  exec        = require('child_process').exec,
  express     = require('express'),
  fs          = require('fs-extra'),
  path        = require('path'),
  webserver   = express(),
  documents = {},
  templates = {},
  snippets  = {};

/* express config */
webserver.set('view engine', 'jade');
webserver.use(compression());
webserver.use(bodyParser.urlencoded({ extended: true }));
webserver.use(express.static('static'));
webserver.use(function(req, res, next) {
  debug(['Served', req.method, req.originalUrl, 'to', req.ip].join(' '));  
  next();
});

webserver.get('/', function (req,res) {
  var jadeLocals = { documents: documents, templates: templates, snippets: snippets };
  jadeLocals.markdown = config.welcomeText;

  // Render the Frontpage via Jade.
  res.render('index', jadeLocals);
});

/* serve the page with a document loaded */
webserver.get('/document/:file', function (req, res) {
  var jadeLocals = { documents: documents, templates: templates, snippets: snippets };
  jadeLocals.file = encodeURIComponent(req.params.file);
  jadeLocals.exportFormats = config.exportFormats;
  
  // get the file contents
  var filePath = config.directories.documents + req.params.file;
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) return res.status(404).end('could not retrieve the document!');
    jadeLocals.markdown = data;

    // Render the Frontpage via Jade.
    res.render('index', jadeLocals);
  });
});

/* serve the page with a template loaded */
webserver.get('/template/:file', function (req, res) {
  var jadeLocals = { documents: documents, templates: templates, snippets: snippets };
  
  // get the file contents
  var filePath = config.directories.templates + req.params.file;
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) return res.status(404).end('could not retrieve the template!');
    jadeLocals.markdown = data;

    // Render the page via Jade including the markdown data.
    res.render('index', jadeLocals);
  });
});

/* serve a snippet */
webserver.get('/snippet/:file', function (req, res) {
  // get the file contents
  var filePath = config.directories.snippets + req.params.file;
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) return res.status(404).end('could not retrieve the snippet!');
    res.send(data);
  });
});

/* save a file & rescan the directories */
webserver.post('/save', function(req, res) {
  var path = config.directories.documents;
  if (req.body.type === 'template') path = config.directories.templates;
  else if (req.body.type === 'snippet') path = config.directories.snippets;
  path += decodeURIComponent(req.body.name);

  fs.outputFile(path, req.body.markdown, function(err) {
    if (err) return res.status(500).end(err.message);
    
    loadDirectories(function(err) {
      if (err) return res.status(500).end(err.message);
      res.json({ saved: true });
    });
  });
});

/* convert the given file to pdf & send it as download
   sideeffect: the pdf file will reside in the documents directory */
webserver.get('/export/:format/:file', function(req, res) {

  var inPath = config.directories.documents + req.params.file,
    inFormat = 'markdown_github+footnotes+definition_lists+raw_html+markdown_in_html_blocks',
    outExtension = config.exportFormats[req.params.format].extension,
    options = config.exportFormats[req.params.format].options,
    outPath = inPath.split('.');
  outPath.pop();
  outPath += outExtension;
  var cmd = ['pandoc -f', inFormat, '-o', outPath, inPath, options].join(' ');
  
  fs.stat(inPath, function(err, inStat) {
    if (err) return res.status(500).end('input file not found');
    
    fs.stat(outPath, function(err, outStat) {
      // if outPath exists & is newer than the source file, send it
      if (!err  && outStat.mtime > inStat.mtime) return res.download(outPath);
      // else generate the output file using pandoc & send it
      else {
        exec(cmd, function(err, stdout, stderr) {
          if (err) return res.status(500).send(stderr);
          res.download(outPath);
        });
      }
    });
  });
});

function loadDirectories(callback) {
  documents = {};
  templates = {};
  snippets = {};
  
  /* walks through a directory [dir] & stores its filepaths in an object [object]
      if they have a filextension as in [extensionFilter] */
  function walkDir(dir, object, extensionFilter, prefix, postfix, done) {
    fs.walk(dir).on('data', function(file) {
      var basePath = file.path.replace(dir, ''),
        fileName = path.basename(basePath),
        fileExt = path.extname(fileName);

      if (file.stats.isFile() && extensionFilter.indexOf(fileExt) !== -1)
        object[fileName] = prefix + encodeURIComponent(basePath) + postfix;
    }).on('end', done);
  }
  
  // make sure the data directories exist & get their contents
  async.series([
    async.apply(fs.ensureDir, config.directories.documents),
    async.apply(fs.ensureDir, config.directories.templates),
    async.apply(fs.ensureDir, config.directories.snippets),
    async.apply(walkDir, config.directories.documents, documents, config.listExtensions, '/document/', ''),
    async.apply(walkDir, config.directories.templates, templates, config.listExtensions, '/template/', ''),
    async.apply(walkDir, config.directories.snippets, snippets, config.listExtensions, 'insertSnippet("', '")')
  ], callback);
}


(function init() {
  loadDirectories(function(err) {
    if (err) return debug('unable to retrieve directory contents: ' + err);
    var server = webserver.listen(config.httpPort, function() {
      debug('Webserver running on port ' + server.address().port);
    });
  });
})();
