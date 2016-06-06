module.exports = {
  httpPort: 2344,
  baseURL: '/protokolle', // url prefix, eg '/editor'

  // paths where the documents will be loaded & saved
  // subdirectories are not accessible
  directories: {
    documents: __dirname + '/data/documents/',
    templates: __dirname + '/data/templates/',
    snippets:  __dirname + '/data/snippets/'
  },

  https: {
    enabled:  false,
    port:     2345,
    keyPath:  '/etc/apache2/ssl/geofs-key.pem',
    certPath: '/etc/apache2/ssl/cert-geofs.pem',
    caPath:   '/etc/apache2/ssl/wwu-calist-2007.pem'
  },

  // requiring authentication on non-https connections is unsafe!
  auth: {
    enabled: true,
    saveOnly: true, // only protect write access
    basic: {
      keyfile: './auth_keys', // path to .htaccess-style keyfile. if null, credentials below are used
      user: 'LSMT',
      pw: 'change_asap'
    }
  },

  // only files with these extensions will be shown in the filelist
  listExtensions: ['.md', '.markdown', '.mmd'],

  // default text on the frontpage / empty document
  welcomeText: '# geofs Protokollfix&trade;\n\n## >howto\n1. Im Menu unter `new` das `FSR Sitzung`-Template laden\n2. Vorlage ausfüllen\n	- unter `insert` finden sich Textschnipsel für Abstimmungen, Tasks, usw\n    - auf Link zu vorherigem Protokoll achten\n3. speichern (unter `save -> as document`, oder mit `ctrl+s`)\n4. ?????\n5. profit!\n\n## >args, wtf soll das hier?!\n- markdown? [**markdown!**](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)\n- bei Fragen: Norwin (oder den FSler deines Vertrauens) fragen\n- bei Bugs & Verbesserungen: pull request [auf github](https://github.com/fs-geofs/Protokollfix) stellen!',

  // formats available for export using pandoc, see http://pandoc.org/README.html
  exportFormats: {
    'PDF': { extension: '.pdf', options: '-t latex -V geometry:margin=2.4cm -N'},
    'LaTeX': { extension: '.tex', options: '-t latex -V geometry:margin=2.4cm -s'},
    'HTML': { extension: '.html', options: '-t html5 -s'},
    'reveal.js-Slides': { extension: '-revealjs.html', options: '-t revealjs -s'},
    'MediaWiki': { extension: '.mediawiki', options: '-t mediawiki -s'},
    'DokuWiki':  { extension: '.dokuwiki', options: '-t dokuwiki -s'},
    'DOCX':  { extension: '.docx', options: ''},
  }
};
