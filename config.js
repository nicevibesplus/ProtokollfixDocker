module.exports = {
  httpPort: 8080,
  
  // Paths where the documents will be loaded & saved
  directories: {
    documents: __dirname + '/data/documents/',
    templates:  __dirname + '/data/templates/',
    snippets:  __dirname + '/data/snippets/'
  },
  
  // only files with these extensions will be shown in the filelist
  listExtensions: ['.md', '.markdown', '.mmd'],
  
  // default text on the frontpage / empty document
  welcomeText: '## Welcome!\n\nStart writing, or select a template above!',
  
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