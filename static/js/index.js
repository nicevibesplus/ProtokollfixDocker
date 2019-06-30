const baseURL = document.querySelector('#baseurl').textContent;

const ABSTIMMUNG = `

#### Abstimmung
über _______

||
------------:|:---
 dafür:      |
 dagegen:    |
 Enthaltung: |
 gesamt:     |

Der Antrag wurde ____.
`

const editor = new EasyMDE({
  autofocus: true,
  autoDownloadFontAwesome: false, // we have a newer version vendored.
  spellChecker: false,

  toolbar: [
    'heading-2',
    'heading-3',
    'unordered-list',
    'link',
    'image',
    'table',
    '|', // Separator
    {
      name: 'task',
      action: function customFunction (editor) {
        editor.codemirror.replaceSelection(`- *${new Date().toLocaleDateString('de')}* **Name**: Task\n`)
      },
      className: 'fas fa-tasks',
      title: 'Task einfügen',
    },
    {
      name: 'abstimmung',
      action: ed => ed.codemirror.replaceSelection(ABSTIMMUNG),
      className: 'fas fa-poll',
      title: 'Abstimmung einfügen',
    },
    '|', // Separator
    'preview',
  ],
});

let notsaved = false;

editor.codemirror.on('change', function () {
  notsaved = true;
});

window.onbeforeunload = function() {
  if (notsaved) return 'Ungespeicherte Änderungen, wirklich schließen?';
};

async function save() {
  const promptTitle = 'Please enter a filename!';
  const dateString = new Date().toISOString().slice(0, 10).replace(/-+/g, '_');

  let fileName;

  // ask for a filename
  if (/\/document/.test(window.location.pathname))
    fileName = decodeURIComponent(window.location.pathname.replace(baseURL + '/document/', ''));
  else if (/\/template/.test(window.location.pathname))
    fileName = prompt('SAVE DOCUMENT\n' + promptTitle, dateString + '_' +
    decodeURIComponent(window.location.pathname.replace(baseURL + '/template/', '')));
  else
    fileName = prompt('SAVE DOCUMENT\n' + promptTitle);

  if (!fileName) return;
  if (fileName.split('.').pop() !== 'md') fileName += '.md';

  const name = encodeURIComponent(fileName)

  const body = JSON.stringify({
    name,
    markdown: editor.value(),
    type: 'document'
  });

  const url = `${baseURL}/api/save`
  const res = await fetch(url, {
    body,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  const { saved } = await res.json()

  notsaved = false
  window.location = saved
}
