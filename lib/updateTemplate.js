const fs = require('fs-extra'),
  config = require('../config');

// filename is YYYY_MM_DD_{TemplateName}.md
// match 1: date, match 2: (template) name, match 3: extension
const filenameRegex = /(\d{4}_\d{2}_\d{2})_([^_\.]+).(.+)/i

function dateFromDocumentName (filename) {
  return new Date(filename.match(filenameRegex)[1].replace(/_/g, '-'))
}
function templateNameFromDocumentName (filename) {
  return filename.match(filenameRegex)[2]
}

const updaters = {
  'FSR-Sitzung': (newDoc, fileName) => {
    // use new document, but:
    // - clean contents, keeping headings
    // - transfer tasks
    // - update dates (previous protokoll url)


    const allTemporarySections = /(?![^\n]*(übliches|tasks)\n)(#+ .*)\n([^#]*)/gi
    const sonstiges = /(# Sonstiges\n+)((.|\n)+)/gi
    const tasksToDrop = /(#+ erledigte tasks\n)([^#]*)/gi
    const tasksToKeep = /#+ (neue|nicht erledigte) tasks\n([^#]*)/gi
    const neueTasks = /(#+ neue tasks\n)([^#]*)/gi
    const alteTasks = /(#+ nicht erledigte tasks\n)([^#]*)/gi

    const tasks = newDoc
      .match(tasksToKeep)                     // find sections with tasks
      .map(m => m.replace(tasksToKeep, '$2')) // extract section body
      .join('\n').split('\n')              // merge tasks from several sections & separate them into flat array
      .map(m => m.trim()).filter(m => !!m) // remove empty lines
      .join('\n')

    const newTemplate = newDoc
      .replace(allTemporarySections, '$2\n\n')
      .replace(sonstiges, '$1\n\n')
      .replace(sonstiges, '$1\n\n')
      .replace(tasksToDrop, '### Erledigte Tasks\n\n\n')
      .replace(neueTasks, '$1\n\n')
      .replace(alteTasks, `$1 ${tasks}\n\n`)
      .replace(RegExp(filenameRegex, 'gi'), fileName.replace(/md$/, 'pdf'))

    return newTemplate
  }
}


function checkIsLatestDocument (fileName) {
  const templateName = templateNameFromDocumentName(fileName)

  const lastDocumentName = fs.readdirSync(config.directories.documents)
    .filter(f => f.endsWith('.md'))
    .filter(name => templateNameFromDocumentName(name) === templateName)
    .sort()
    .pop()

  const lastDocumentTime = dateFromDocumentName(lastDocumentName)

  return (
    fileName === lastDocumentName ||
    dateFromDocumentName(fileName).getTime() - lastDocumentTime.getTime() > 0
  )
}

function updateTemplate(newDocument, fileName) {
  try {
    const templateName = templateNameFromDocumentName(fileName)
    const templatePath = config.directories.templates + templateName + '.md'

    if (!updaters[templateName]) return
    if (!checkIsLatestDocument(fileName)) return

    const newTemplate = updaters[templateName](newDocument, fileName)
    fs.writeFileSync(templatePath, newTemplate, 'utf8')
  } catch (err) {
    console.error(`could not update template: ${err}`)
  }
}

module.exports = {
  checkIsLatestDocument,
  updaters,
  updateTemplate,
}
