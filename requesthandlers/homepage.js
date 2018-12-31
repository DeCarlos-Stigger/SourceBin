const fs = require('fs');
const { Converter, Methods } = require('../utils');

const languages = require('../json/languages.json');
const themes = require('../json/themes.json');

const converter = new Converter({
  languages: `[${Object.keys(languages).map(lang => `"${lang}"`)}]`,
  themes: `[${themes.map(theme => `"${theme.name}"`)}]`
});
const convert = converter.convert.bind(converter);

module.exports = (router, limiters, { bins }) => {
  const homepage = fs.readFileSync('./html/homepage/index.html').toString();

  // Homepage
  router.get('/', limiters.loadPage, res => {
    return res.html(200, convert(homepage));
  });

  // Bin
  router.get(/^([a-f0-9]{10})(\.[a-zA-Z0-9]+)?$/, limiters.loadPage, (res, data) => {
    bins.findOne({ key: data.matches[1] }).then(bin => {
      if (!bin) return res.html(200, convert(homepage));
      const language = Methods.findLanguage(data.matches[2], 'extension');

      return res.html(200, convert(homepage, {
        code: Methods.escapeHtml(bin.code),
        key: data.matches[1] ? `'${data.matches[1]}'` : null,
        language: JSON.stringify({
          name: language.name,
          ace_mode: language.ace_mode,
          extension: language.extensions[0]
        }),
        allowSave: 'false',
        color: language && language.color ? language.color : null
      }));
    });
  });
}
