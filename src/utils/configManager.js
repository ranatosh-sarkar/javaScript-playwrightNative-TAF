const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../config/.env') });

class ConfigManager {
  constructor() {
    if (ConfigManager.instance) return ConfigManager.instance;
    this.env = process.env.ENV || 'QA';

    const cfgPath = path.resolve(__dirname, '../../config/config.json');
    const raw = fs.readFileSync(cfgPath, 'utf-8');
    const json = JSON.parse(raw);

    this.current = json[this.env];
    if (!this.current) throw new Error(`No config for ENV="${this.env}"`);

    ConfigManager.instance = this;
  }
  
  get(key) { 
    return this.current[key]; 
  }
}
module.exports = new ConfigManager();
