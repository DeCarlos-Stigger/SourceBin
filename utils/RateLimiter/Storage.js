class Storage {

  /**
   * @param {Number} max The max amount of hits per windowMs
   * @param {Number} windowMs The time window for hits
   */
  constructor(max, windowMs) {
    /**
     * The max amount of hits per windowMs
     * @type {Number}
     */
    this.max = max;

    /**
     * The time window for hits
     * @type {Number}
     */
    this.windowMs = windowMs;

    /**
     * Hits stored by key
     * @type {Map<*, Array<Date>>}
     */
    this.hits = new Map();

    setInterval(() => {
      for (const [key, dates] of this.hits) {
        this.hits.set(key, dates.filter(date => date < new Date()));
      }
    }, 1000 * 60 * 60);
  }

  /**
   * Ratelimit a key
   * @param {*} key The key to ratelimit
   * @returns {Boolean} Whether to limit the request
   */
  rateLimit(key) {
    const now = new Date();
    const dates = this.hits.get(key) || [];
    if (dates.length === this.max) {
      if (dates[0] > now) return true;
      else dates.shift();
    }
    dates.push(now + this.windowMs);
    this.hits.set(key, dates);
    return false;
  }
}
