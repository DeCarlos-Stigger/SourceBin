const fs = require('fs');
const { Methods } = require('../utils');

module.exports = (router, limiters) => {

  router.get(/^assets\/(.+?\.(js|css))$/, limiters.loadAssets, (res, data) => {
    fs.readFile(`./html/${data.matches[1]}`, (err, content) => {
      if (err) return res.json(404, { error: 'File not found' });
      else return res[data.matches[2]](200, content);
    });
  });

  router.get('/language', limiters.languageTheme, (res, data) => {
    const { query: { search } } = data;
    if (!search) return res.json(400, { error: 'Expected a search' });

    const language = Methods.findLanguage(search, 'name');
    if (!language) return res.json(404, { error: 'No language found' });

    return res.json(200, language);
  });

  router.get('/theme', limiters.languageTheme, (res, data) => {
    const { query: { search } } = data;
    if (!search) return res.json(400, { error: 'Expected a search' });

    const theme = Methods.findTheme(search, 'name');
    if (!theme) return res.json(404, { error: 'No theme found' });

    return res.json(200, theme);
  });
}
