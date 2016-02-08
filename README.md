![lsmt logo](/static/img/logo.png?raw=true)
### LaTeX sucks - markdown too.

---

This is just another markdown editor for the browser.

It has some features that might make it interesting though:

## features

- **read/write on file system**
	- documents are read/written directly on the filesystem, which makes their use in other applications really easy
    - *this also means that this application does not scale well, and is intended for single- (or few-) user scenarios only*
- create documents from **templates**
- insert custom **text snippets**
- proper editor with **syntax highlighting, undo, autoindent, drag/drop & shortcuts**
- exports through **pandoc integration**
	- directly convert & download documents using pandoc.
    - technically all pandoc supported formats can be used, currently implemented are `PDF`, `HTML5`, `DOCX`, `LaTeX`, `reveal.js`, `MediaWiki`, `DokuWiki`
- **mailto link** for the current document
- **view mode**, which hides the editor for a pure presentation of the document
- **responsive layout**

## dependencies

- [`nodejs v0.12`](https://nodejs.org/en/download/)
- [`pandoc v1.12`](http://pandoc.org/installing.html)
- `texlive` or some other TeX distro for PDF export

## install

1. install the above dependencies
2. clone this repo & install npm & bower dependencies
	
        git clone https://github.com/noerw/LSMT.git
        cd LSMT
        npm install

If npm reports issues installing bower globally, [change the path to the global npm packages
to a directory you have write access to](http://www.competa.com/blog/2014/12/how-to-run-npm-without-sudo/),
which is a good idea anyway.
Alternatively install bower with sudo (`sudo npm install -g bower`) & run `bower install` manually.

## run

	npm start

For debug output you may run `npm test`.

## license
GPL-3.0

Used software packages are licensed under their own terms.
