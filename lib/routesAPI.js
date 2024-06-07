var exec   = require('child_process').exec,
  fs       = require('fs-extra'),
  sanitize = require('sanitize-filename'),
  config   = require('../config'),
  loadDirectories = require('./loadDirectories'),
  router   = require('express').Router();

const { updateTemplate } = require('./updateTemplate')

/* save a file & rescan the directories */
router.post('/save', function(req, res) {
  var path = config.directories.documents;
  var fileName = sanitize(decodeURIComponent(req.body.name)).replace(/\s+/g, '_');

  createFileBackup(path + fileName);
  fs.outputFile(path + fileName, req.body.markdown, function(err) {
    if (err) return res.status(500).end(err.message);

    updateTemplate(req.body.markdown, fileName)

    // export to PDF by default
    exportFile(path + fileName, 'PDF', function (err, outFile) {
      if (err) return res.status(500).end(err.message);

      // update document  list
      loadDirectories(function(err, result) {
        if (err) return res.status(500).end(err.message);
        req.app.locals = result;
        res.json({ saved: config.baseURL + '/' + req.body.type + '/' + fileName });
      });
    });
  });
});

/* convert the given file to pdf & send it as download
   sideeffect: the pdf file will reside in the documents directory */
router.get('/export/:format/:file', function(req, res) {
  const inPath = config.directories.documents + sanitize(req.params['file']);
  const format = req.params['format'];
  const outPath = getExportFileName(inPath, format);

  fs.stat(inPath, function(err, inStat) {
    if (err) return res.status(500).end('input file not found');

    fs.stat(outPath, function(err, outStat) {
      // if outPath exists & is newer than the source file, send it
      if (!err && outStat.mtime > inStat.mtime) return res.download(outPath);
      // else generate the output file using pandoc & send it
      else {
        exportFile(inPath, format, function(err, outFile) {
          if (err) return res.status(500).send(err);
          res.download(outFile);
        });
      }
    });
  });
});

function getExportFileName (mdFile, format) {
  const expFormat = config.exportFormats[format];
  let outPath = mdFile.split('.');
  outPath.pop();
  outPath += expFormat.extension;
  return outPath;
}

// exports a file to the given outpath
// does NO input validation!! (but nothing does in this app...)
function exportFile (file, format, cb) {
  const outFile = getExportFileName(file, format);
  const opts = config.exportFormats[format].options;
  const cmd = ['pandoc -o', outFile, file, opts].join(' ');

  createFileBackup(outFile);
  exec(cmd, function(err, stdout, stderr) {
    cb(err ? stderr + stdout : null, outFile);
  });
}

function createFileBackup(file) {
  if (!fs.existsSync(file)) return
  const backPath = file + '.bak';
  let i = 0;
  while (fs.existsSync(backPath + i)) i++;
  fs.copyFileSync(file, backPath + i);
}

module.exports = router;
