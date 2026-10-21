// Erzeugt data/icons.json (Bilder als data-URIs) aus icons/<id ohne Unterstriche>.jpg
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const data = require(path.join(root, 'data', 'units.json'));
const icons = {};
const missing = [];
data.units.forEach(u => {
  const file = path.join(root, 'icons', u.id.replace(/_/g, '') + '.jpg');
  if (fs.existsSync(file)) icons[u.id] = 'data:image/jpeg;base64,' + fs.readFileSync(file).toString('base64');
  else missing.push(u.id);
});
fs.writeFileSync(path.join(root, 'data', 'icons.json'), JSON.stringify(icons));
console.log('Bilder:', Object.keys(icons).length, '| ohne Bild:', missing.join(', ') || '-');
