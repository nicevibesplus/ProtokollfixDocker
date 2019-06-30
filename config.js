module.exports = {
  httpPort: 2344,
  baseURL: '/protokolle', // url prefix, eg '/editor'

  // paths where the documents will be loaded & saved
  // subdirectories are not accessible
  directories: {
    documents: __dirname + '/data/documents/',
    templates: __dirname + '/data/templates/',
  },

  // only files with these extensions will be shown in the filelist
  listExtensions: ['.md', '.markdown', '.mmd'],

  // formats available for export using pandoc, see http://pandoc.org/README.html
  exportFormats: {
    'PDF': { extension: '.pdf', options: '-f markdown_github -t latex -V geometry:margin=2.4cm -N'},
    'LaTeX': { extension: '.tex', options: '-t latex -V geometry:margin=2.4cm -s'},
    'HTML': { extension: '.html', options: '-t html5 -s'},
    'reveal.js-Slides': { extension: '-revealjs.html', options: '-t revealjs -s'},
    'MediaWiki': { extension: '.mediawiki', options: '-t mediawiki -s'},
    'DokuWiki':  { extension: '.dokuwiki', options: '-t dokuwiki -s'},
    'DOCX':  { extension: '.docx', options: ''},
  }
};
