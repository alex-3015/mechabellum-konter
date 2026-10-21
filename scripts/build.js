// Baut die fertige Seite (index.html) aus Vorlage, Daten, Bildern, Techs und Sprachdateien.
// Bricht ab, wenn die Sprachprüfung fehlschlägt (Regel: alle Texte in allen Sprachen).
// node scripts/build.js            -> streng (für CI und Pull Requests)
// ALLOW_MISSING=1 node scripts/...  -> fehlende Sprachdateien erlaubt (lokaler Zwischenstand)
const fs = require('fs');
const path = require('path');
const { check } = require('./check-i18n');
const ROOT = path.join(__dirname, '..');
const R = (...p) => path.join(ROOT, ...p);
const readJson = (...p) => JSON.parse(fs.readFileSync(R(...p), 'utf8'));

// 1. Sprachen prüfen
const res = check({ allowMissing: !!process.env.ALLOW_MISSING });
res.warnings.forEach(w => console.log('Warnung:', w));
if (res.errors.length) {
  res.errors.forEach(e => console.log('FEHLER:', e));
  console.log(`Build abgebrochen: ${res.errors.length} Fehler in den Sprachdateien.`);
  process.exit(1);
}

// 2. Daten prüfen und anreichern (Namen aller Sprachen aus den Spieltexten)
const data = readJson('data', 'units.json');
const game = readJson('data', 'gametexts.json').texts;
const techrefs = readJson('data', 'techrefs.json');
const ids = new Set(data.units.map(u => u.id));
const problems = [];
const en2key = {};
Object.entries(game).forEach(([k, v]) => {
  if (/^MechData\/name_\d+$/.test(k)) { const n = +k.split('_').pop(); if ((n <= 50 || n === 2001 || n === 2002) && !en2key[v.en]) en2key[v.en] = k; }
});
data.units.forEach(u => {
  ['strong', 'weak'].forEach(k => (u[k] || []).forEach(r => {
    if (!ids.has(r.id)) problems.push(`${u.id}.${k} -> ${r.id} (unbekannt)`);
    if (r.id === u.id) problems.push(`${u.id}.${k} -> sich selbst`);
  }));
  const s = new Set((u.strong || []).map(r => r.id));
  (u.weak || []).forEach(r => { if (s.has(r.id)) problems.push(`${u.id}: ${r.id} in strong UND weak`); });
  if (!u.stage) problems.push(`${u.id}: keine Ingame-Stufe (stage)`);
  if (!en2key[u.name]) problems.push(`${u.id}: Name "${u.name}" nicht in den Spieltexten`);
  else u.names = game[en2key[u.name]];
});
data.techNames = Object.fromEntries(Object.entries(techrefs).map(([ref, key]) => [ref, game[key]]));
if (problems.length) { problems.forEach(p => console.log('FEHLER:', p)); process.exit(1); }

// 3. Sprachdateien einbetten
const strings = {};
res.languages.forEach(({ code }) => { const f = R('i18n', code + '.json'); if (fs.existsSync(f)) strings[code] = readJson('i18n', code + '.json'); });
const i18n = { languages: res.languages, strings };

// "<" maskieren, damit kein "</script>" im eingebetteten JSON landet
const safe = s => s.replace(/</g, '\\u003c');
const html = fs.readFileSync(R('src', 'template.html'), 'utf8')
  .replace('/*__UNIT_DATA__*/', () => safe(JSON.stringify(data)))
  .replace('/*__ICON_DATA__*/', () => safe(fs.readFileSync(R('data', 'icons.json'), 'utf8')))
  .replace('/*__TECH_DATA__*/', () => safe(fs.readFileSync(R('data', 'techs.page.json'), 'utf8')))
  .replace('/*__I18N_DATA__*/', () => safe(JSON.stringify(i18n)));
fs.writeFileSync(R('index.html'), html);
console.log(`Einheiten: ${data.units.length} | Sprachen eingebettet: ${Object.keys(strings).join(', ')} | Größe: ${Math.round(html.length / 1024)} KB`);
console.log('geschrieben: index.html');
