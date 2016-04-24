module.exports = {
  httpPort: 8080,
  baseURL: '', // url prefix, eg '/editor'

  // paths where the documents will be loaded & saved
  // subdirectories are not accessible
  directories: {
    documents: __dirname + '/data/documents/',
    templates: __dirname + '/data/templates/',
    snippets:  __dirname + '/data/snippets/'
  },

  https: {
    enabled:  false,
    port:     8443,
    keyPath:  __dirname + '/private.key',
    certPath: __dirname + '/certificate.pem',
    caPath:   null // specify path if needed
  },

  // requiring authentication on non-https connections is unsafe!
  auth: {
    enabled: false,
    saveOnly: false, // only protect write access
    basic: {
      keyfile: null, // path to .htaccess-style keyfile. if null, credentials below are used
      user: 'LSMT',
      pw: 'change_asap'
    }
  },

  // only files with these extensions will be shown in the filelist
  listExtensions: ['.md', '.markdown', '.mmd'],

  // default text on the frontpage / empty document
  welcomeText: '# Welcome!\n![LSMT](img/logo.png)\n\nStart writing **markdown**, or select a template above!\n\nFor more info on this editor see [here](https://github.com/noerw/LSMT).',

  // formats available for export using pandoc, see http://pandoc.org/README.html
  exportFormats: {
    'PDF': { extension: '.pdf', options: '-t latex -V geometry:margin=2.4cm'},
    'LaTeX': { extension: '.tex', options: '-t latex -V geometry:margin=2.4cm -s'},
    'HTML': { extension: '.html', options: '-t html5 -s'},
    'reveal.js-Slides': { extension: '-revealjs.html', options: '-t revealjs -s'},
    'MediaWiki': { extension: '.mediawiki', options: '-t mediawiki -s'},
    'DokuWiki':  { extension: '.dokuwiki', options: '-t dokuwiki -s'},
    'DOCX':  { extension: '.docx', options: ''},
  }
};
