const log4js = require('log4js');
const path = require('path');

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: {
      type: 'dateFile',
      filename: path.resolve(__dirname, '../../logs/execution.log'),
      pattern: '.yyyy-MM-dd',
      backups: 3,
      compress: true
    }
  },
  categories: { default: { appenders: ['console', 'file'], level: 'info' } }
});

class Logger {
  constructor() {
    if (Logger.instance) return Logger.instance;
    this.l = log4js.getLogger();
    Logger.instance = this;
  }
  info(m){ this.l.info(m); }
  error(m){ this.l.error(m); }
  debug(m){ this.l.debug(m); }
}
module.exports = new Logger();
