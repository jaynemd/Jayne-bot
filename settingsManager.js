const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, 'library/settings.json');

function loadSettings() {
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify({
      autoread: { enabled: false },
      autorecord: { enabled: false },
      autotyping: { enabled: false }
    }, null, 2));
  }

  return JSON.parse(fs.readFileSync(settingsPath));
}

function saveSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

module.exports = { loadSettings, saveSettings };