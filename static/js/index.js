var codemirror;

function save(type) {
  var dateString, fileName, data;
  
  dateString = new Date().toISOString().slice(0, 10);
  
  var promptTitle = 'Please enter a filename!';
  // ask for a filename
  if (type == 'template')
    fileName = prompt('SAVE TEMPLATE\n' + promptTitle);
  else if (type == 'snippet')
    fileName = prompt('SAVE SNIPPET\n' + promptTitle);
  else if (/^\/document/.test(window.location.pathname))
    fileName = decodeURIComponent(window.location.pathname.replace('/document/', ''));
  else if (/^\/template/.test(window.location.pathname))
    fileName = prompt('SAVE DOCUMENT\n' + promptTitle, dateString + '_' +
     decodeURIComponent(window.location.pathname.replace('/template/', '')));
  else
    fileName = prompt('SAVE DOCUMENT\n' + promptTitle);
  
  // stop invalid filename or user has canceld
  if (!fileName) return;
  
  // ensure we save with .md extension
  if (fileName.split('.').pop() !== 'md') fileName += '.md';

  data = {
    name: encodeURIComponent(fileName),
    markdown: codemirror.getValue(),
    type: type || 'document'
  };
  
  $.post('/save', data, function(res) {
    if (res.saved && type === 'snippet') window.location = '/';
    else if (res.saved) window.location = res.saved;
  });
}

function mail(type) {
  var content, mailtoLink = 'mailto:?to=&body=';
  if (type === 'html')
    content = $('#html-preview').html();
  else if (type === 'markdown')
    content = codemirror.getValue();
  
  if (!content) return;
  mailtoLink += encodeURIComponent(content);
  window.location = mailtoLink;
}

function toggleViewMode() {
  var btnTxt = $('#btn-mode').html();

  if (btnTxt.indexOf('view') === -1) {
    btnTxt = btnTxt.replace('edit', 'view').replace('pencil', 'blackboard');
    window.location.hash = '';
  } else {
    btnTxt = btnTxt.replace('view', 'edit').replace('blackboard', 'pencil');
    window.location.hash = 'viewmode';
  }

  $('#btn-mode').html(btnTxt);
  $('#rightcolumn').toggleClass('fullheight col-sm-6 col-sm-12');
  $('#leftcolumn').toggleClass('hidden');
  $('#btn-help').toggleClass('hidden');
  $('#menu-templates').toggleClass('hidden');
  $('#menu-snippets').toggleClass('hidden');
  $('#menu-save').toggleClass('hidden');
}

function insertSnippet(path) {
  $.get('/snippet/' + encodeURIComponent(path), function(data) {
    codemirror.replaceSelection(data);
  });
}

$(document).ready(function() {
  
  marked.setOptions({
    pedantic: true,
  });
  
  $('#html-preview').html(marked($('#md-textarea').val()));
  
  codemirror = CodeMirror.fromTextArea($('#md-textarea')[0], {
    mode: 'gfm',
    lineWrapping: true,
    autofocus: true,
    extraKeys: {
      'Ctrl-S': function(cm) { save(); },
      'Ctrl-N': function(cm) { window.location = '/'; }
    }
  });
  
  codemirror.on('change', function() {
     $('#html-preview').html(marked(codemirror.getValue()));
  });
  
  // start in view mode, if we have a device with one-column view or its specified in the url hash
  if($(window).width() < 767 || window.location.hash == '#viewmode')
    toggleViewMode();
});