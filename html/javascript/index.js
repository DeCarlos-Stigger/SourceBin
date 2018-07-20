function Bin(options, languages) {
  const disabled = new Set();
  this.isDisabled = name => disabled.has(name);

  let key = options.key;
  let language = options.language;
  const readOnly = options.readOnly;

  const editor = ace.edit('editor');
  editor.setTheme('ace/theme/material');
  editor.setReadOnly(readOnly);
  editor.setFontSize(15);
  if (editor.getValue() === 'Loading...') editor.setValue('', -1);
  this.LanguageSelector = new LanguageSelector(this, editor);

  this.focus = () => editor.focus();
  this.setReadOnly = boolean => editor.setReadOnly(boolean);
  this.setURL = () => {
    let url = window.location.origin;
    if (key) {
      url += '/' + key;
      if (language) url += '.' + language.extension;
    }
    return window.history.pushState(null, null, url);
  }
  this.setLanguage = lang => {
    if (lang) language = lang;
    if (!language) return;
    document.getElementById('lang').innerHTML = `Language - ${language.name}`;
    return editor.session.setMode(`ace/mode/${language.ace}`);
  }
  this.save = () => {
    if (this.isDisabled('Save')) return;
    this.disableSave();
    editor.setReadOnly(true);
    this.LanguageSelector.show();
    return _request('post', '/', editor.getValue())
      .then(response => {
        if (response) key = response.key;
        return this.setURL();
      });
  }
  this.disableSave = () => {
    const save = document.getElementById('save');
    const className = save.className;
    save.className += className.includes('disabled') ? '' : ' disabled';
    return disabled.add('Save');
  }

  this.setURL();
  this.setLanguage();
  if (!options.saving) this.disableSave();
}

function LanguageSelector(bin, editor) {
  const input = document.getElementById('search');

  const addLanguages = () => {
    const search = input.value.toLowerCase();
    const options = document.getElementById('options');
    options.innerHTML = '';
    const language = languages.filter(lang => lang.toLowerCase().includes(search));
    for (const lang of language) {
      const language = document.createElement('div');
      language.className = 'box';
      language.innerHTML = lang;
      options.appendChild(language);
      language.addEventListener('click', event => {
        const name = event.target.innerHTML;
        return _request('get', `/language?search=${encodeURIComponent(name)}`).then(response => {
          if (!response) return;
          bin.setLanguage(response);
          bin.setURL();
          return this.hide();
        });
      });
    }
  }
  input.addEventListener('input', addLanguages);

  this.show = () => {
    document.getElementById('language').setAttribute('style', 'display:inherit');
    addLanguages();
    return input.focus();
  }

  this.hide = () => {
    document.getElementById('language').setAttribute('style', 'display:none');
    return editor.focus();
  }
}
