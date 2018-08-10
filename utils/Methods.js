const crypto = require('crypto');
const languages = require('../json/languages.json');
const themes = require('../json/themes.json');

class Methods {

  /**
   * Generates a random 8 char key
   * @returns {String}
   */
  static generateKey() {
    return crypto.randomBytes(4).toString('hex');
  }

  /**
   * Strip a path to get the key and extension out of it
   * @param {String} path The path to strip
   * @returns {Object}
   */
  static stripPath(path) {
    const match = /([a-f0-9]{8})\.?([a-zA-Z0-9]+)?/.exec(path.split('/')[0]) || [];
    return { key: match[1], extension: match[2] };
  }

  /**
   * Find a language by search
   * @param {String} search The search query
   * @param {String} [type] What type to search for, can be `ace`, `name` or `extension`
   * @returns {?Object}
   */
  static findLanguage(search, type) {
    if (!search) return null;
    return languages.find(lang => {
      if (type) return lang[type.toLowerCase()].toLowerCase() === search.toLowerCase();
      else return [lang.ace, lang.name.toLowerCase(), lang.extension].includes(search.toLowerCase());
    });
  }

  /**
   * Find a theme by search
   * @param {String} search The search query
   * @param {String} [type] What type to search for, can be `ace` or `name`
   * @returns {Object}
   */
  static findTheme(search, type) {
    return themes.find(theme => {
      if (type) return theme[type.toLowerCase()].toLowerCase() === search.toLowerCase();
      else return [theme.ace, theme.name.toLowerCase()].includes(search.toLowerCase());
    });
  }
}
module.exports = Methods;
