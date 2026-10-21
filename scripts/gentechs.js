// Erzeugt techs.page.json (Namen/Spieltexte aus den Spieldateien) und prüft die Regeln gegen die Konter-Daten
const fs = require('fs');
const path = require('path');
const D = f => path.join(__dirname, '..', 'data', f);
const cfg = require(D('techs.config.js'));
const game = require(D('techs.json'));
const data = require(D('units.json'));
const byId = Object.fromEntries(data.units.map(u => [u.id, u]));

const out = cfg.map(c => {
  const g = game.find(e => e.table === c.table && e.nums.includes(c.num));
  if (!g) throw new Error('Tech nicht in Spieldateien: ' + c.key);
  if (!byId[c.unit]) throw new Error('Einheit unbekannt: ' + c.unit);
  [...(c.add || []), ...(c.weaken || [])].forEach(r => { if (!byId[r.a] || !byId[r.b]) throw new Error('Paar unbekannt: ' + c.key); });
  return { key: c.key, unit: c.unit, name: g.name, name_de: g.name_de, desc: g.description, desc_de: g.description_de,
    level: c.level, set: c.set, effect: c.effect, add: c.add, weaken: c.weaken, gameId: c.num };
});
fs.writeFileSync(D('techs.page.json'), JSON.stringify(out, null, 1));

// gleiche Regeln wie auf der Seite
const tgt = u => /both/.test(u.targets) ? 'both' : /air/.test(u.targets) ? 'air' : 'ground';
const flies = u => u.class === 'air' || (u.tags || []).some(t => /fliegt|flying/i.test(t));
function flags(u, act) {
  const f = { hitsAir: tgt(u) !== 'ground', hitsGround: tgt(u) !== 'air', flies: flies(u), src: {} };
  out.filter(t => t.unit === u.id && act.has(t.key) && t.set).forEach(t => Object.entries(t.set).forEach(([k, v]) => { f[k] = v; f.src[k] = t; }));
  return f;
}
function breaker(a, b, why, act) {
  const fa = flags(a, act), fb = flags(b, act);
  if (fb.flies && !fa.hitsAir) return fa.src.hitsAir || fb.src.flies || 'base';
  if (!fb.flies && !fa.hitsGround) return fa.src.hitsGround || fb.src.flies || 'base';
  if (/Luft nicht treffen/i.test(why || '')) {
    if (!fa.flies) return fa.src.flies || 'base';
    if (fb.hitsAir) return fb.src.hitsAir || 'base';
  }
  return null;
}
const pairs = [];
data.units.forEach(u => {
  u.strong.forEach(r => pairs.push([u, byId[r.id], r.why]));
  u.weak.forEach(r => pairs.push([byId[r.id], u, r.why]));
});
const none = new Set();
const bad = pairs.filter(([a, b, w]) => breaker(a, b, w, none));
console.log('Unstimmige Grund-Konter (ohne Tech):', bad.length ? '\n  ' + bad.map(([a, b, w]) => `${a.id} > ${b.id} (${w})`).join('\n  ') : 'keine');
out.forEach(t => {
  const act = new Set([t.key]);
  const gone = pairs.filter(([a, b, w]) => breaker(a, b, w, act) === t).map(([a, b]) => `${a.id}>${b.id}`);
  const uniq = [...new Set(gone)];
  console.log(`${t.key.padEnd(16)} ${t.level.padEnd(8)} entfällt: ${uniq.join(', ') || '-'}${t.add ? ' | neu: ' + t.add.map(r => r.a + '>' + r.b).join(', ') : ''}${t.weaken ? ' | geschwächt: ' + t.weaken.map(r => r.a + '>' + r.b).join(', ') : ''}`);
});
