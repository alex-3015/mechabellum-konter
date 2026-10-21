// Prüft die Sprachdateien gegen die Regel: Jeder Text existiert in ALLEN Sprachen aus i18n/languages.json.
// node scripts/check-i18n.js            -> Fehler bei fehlenden Sprachen/Texten (für CI und Pull Requests)
// ALLOW_MISSING=1 node scripts/...      -> fehlende Sprachdateien nur als Warnung (nur für lokale Zwischenstände)
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const R = (...p) => path.join(ROOT, ...p);

function check({ allowMissing = false } = {}) {
  const errors = [], warnings = [];
  const languages = JSON.parse(fs.readFileSync(R('i18n', 'languages.json'), 'utf8'));
  const source = (languages.find(l => l.source) || {}).code;
  if (!source) errors.push('languages.json: keine Quellsprache ("source": true) definiert');
  const load = code => {
    const f = R('i18n', code + '.json');
    if (!fs.existsSync(f)) return null;
    try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { errors.push(`${code}.json: kein gültiges JSON (${e.message})`); return null; }
  };
  const src = load(source) || {};
  const units = JSON.parse(fs.readFileSync(R('data', 'units.json'), 'utf8')).units;
  const unitIds = new Set(units.map(u => u.id));
  const techrefs = JSON.parse(fs.readFileSync(R('data', 'techrefs.json'), 'utf8'));
  const cfg = require(R('data', 'techs.config.js'));
  const game = JSON.parse(fs.readFileSync(R('data', 'gametexts.json'), 'utf8')).texts;

  // 1. Quellsprache deckt alle Inhalte ab (jede Konter-Beziehung, jeder Tag, jede Tech) und hat keine verwaisten Texte
  const needed = new Set();
  units.forEach(u => {
    u.strong.forEach(r => needed.add(`why.s.${u.id}.${r.id}`));
    u.weak.forEach(r => needed.add(`why.w.${u.id}.${r.id}`));
    (u.tags || []).forEach(t => needed.add('tag.' + t));
  });
  cfg.forEach(c => {
    needed.add(`tech.${c.key}.effect`);
    (c.add || []).forEach(r => needed.add(`tech.${c.key}.add.${r.a}.${r.b}`));
    (c.weaken || []).forEach(r => needed.add(`tech.${c.key}.weaken.${r.a}.${r.b}`));
  });
  needed.forEach(k => { if (!(k in src)) errors.push(`${source}.json: Text fehlt für ${k}`); });
  Object.keys(src).forEach(k => {
    if (/^(why|tag|tech)\./.test(k) && !needed.has(k)) errors.push(`${source}.json: verwaister Text ${k} (gehört zu keinem Datensatz)`);
    if (/^note\./.test(k) && !unitIds.has(k.slice(5))) errors.push(`${source}.json: Hinweis für unbekannte Einheit ${k}`);
  });

  // 2. Jede Sprache hat exakt dieselben Schlüssel, Platzhalter und keine leeren Texte
  const ph = s => (String(s).match(/\{[^}]+\}/g) || []).sort().join('|');
  const en2loc = {};
  Object.entries(game).forEach(([k, v]) => {
    if (/^MechData\/name_\d+$/.test(k)) { const n = +k.split('_').pop(); if ((n <= 50 || n === 2001 || n === 2002) && !en2loc[v.en]) en2loc[v.en] = v; }
  });
  languages.forEach(({ code }) => {
    const x = code === source ? src : load(code);
    if (!x) { (allowMissing ? warnings : errors).push(`${code}.json fehlt (Regel: jede Sprache aus languages.json braucht alle Texte)`); return; }
    const keys = Object.keys(src);
    keys.forEach(k => { if (!(k in x)) errors.push(`${code}.json: Text fehlt: ${k}`); });
    Object.keys(x).forEach(k => { if (!(k in src)) errors.push(`${code}.json: Schlüssel gibt es in ${source}.json nicht: ${k}`); });
    keys.forEach(k => {
      if (!(k in x)) return;
      if (!String(x[k]).trim()) errors.push(`${code}.json: leerer Text: ${k}`);
      if (ph(src[k]) !== ph(x[k])) errors.push(`${code}.json: Platzhalter weichen ab bei ${k}: ${ph(src[k]) || '-'} ≠ ${ph(x[k]) || '-'}`);
    });
    // Platzhalter verweisen auf existierende Einheiten/Techs
    Object.entries(x).forEach(([k, v]) => {
      String(v).replace(/\{u:([^}]+)\}/g, (m, id) => { if (!unitIds.has(id)) errors.push(`${code}.json: unbekannte Einheit ${m} in ${k}`); });
      String(v).replace(/\{t:([^}]+)\}/g, (m, ref) => { if (!techrefs[ref]) errors.push(`${code}.json: unbekannte Tech ${m} in ${k}`); });
    });
    // Einheitennamen gehören in Platzhalter: englischer Name im Fließtext einer anderen Sprache ist verdächtig
    if (code !== 'en') {
      units.forEach(u => {
        const loc = en2loc[u.name];
        if (!loc || loc[code] === u.name) return;
        const re = new RegExp('(^|[^\\p{L}])' + u.name.replace(/ /g, '\\s') + '(?![\\p{L}])', 'u');
        Object.entries(x).forEach(([k, v]) => { if (re.test(v)) warnings.push(`${code}.json: englischer Einheitenname "${u.name}" direkt im Text ${k} – {u:${u.id}} verwenden`); });
      });
    }
  });
  return { errors, warnings, languages, source };
}

if (require.main === module) {
  const { errors, warnings } = check({ allowMissing: !!process.env.ALLOW_MISSING });
  warnings.forEach(w => console.log('Warnung:', w));
  errors.forEach(e => console.log('FEHLER:', e));
  console.log(errors.length ? `${errors.length} Fehler, ${warnings.length} Warnungen` : `Sprachen ok (${warnings.length} Warnungen)`);
  process.exit(errors.length ? 1 : 0);
}
module.exports = { check };
