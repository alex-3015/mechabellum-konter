// Baut die fertige Seite aus Vorlage und Daten.
// node scripts/build.js <template> <units.json> <out.html> [icons.json] [techs.page.json]
const fs = require('fs');
const [tpl, dataPath, out, iconPath, techPath] = process.argv.slice(2);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Konsistenz der Konter-Daten prüfen
const ids = new Set(data.units.map(u => u.id));
const problems = [];
data.units.forEach(u => {
  ['strong', 'weak'].forEach(k => (u[k] || []).forEach(r => {
    if (!ids.has(r.id)) problems.push(`${u.id}.${k} -> ${r.id} (unbekannt)`);
    if (r.id === u.id) problems.push(`${u.id}.${k} -> sich selbst`);
  }));
  const s = new Set((u.strong || []).map(r => r.id));
  (u.weak || []).forEach(r => { if (s.has(r.id)) problems.push(`${u.id}: ${r.id} in strong UND weak`); });
  if (!u.stage) problems.push(`${u.id}: keine Ingame-Stufe (stage)`);
});
const classes = {};
data.units.forEach(u => { classes[u.class] = (classes[u.class] || 0) + 1; });
console.log('Einheiten:', data.units.length, 'Klassen:', JSON.stringify(classes));
console.log('Probleme:', problems.length ? '\n  ' + problems.join('\n  ') : 'keine');

// "<" maskieren, damit kein "</script>" im eingebetteten JSON landet
const safe = s => s.replace(/</g, '\\u003c');
const json = safe(JSON.stringify(data, null, 1));
const icons = iconPath ? safe(fs.readFileSync(iconPath, 'utf8')) : '{}';
const techs = techPath ? safe(fs.readFileSync(techPath, 'utf8')) : '[]';
const html = fs.readFileSync(tpl, 'utf8')
  .replace('/*__UNIT_DATA__*/', () => json)
  .replace('/*__ICON_DATA__*/', () => icons)
  .replace('/*__TECH_DATA__*/', () => techs);
fs.writeFileSync(out, html);
console.log('geschrieben:', out);
