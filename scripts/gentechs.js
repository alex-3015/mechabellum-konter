// Erzeugt data/techs.page.json: Tech-Namen und Spieltexte in allen Sprachen aus data/gametexts.json,
// dazu die Regeln aus data/techs.config.js. Prüft außerdem, welche Konter jede Tech ändert.
const fs = require('fs');
const path = require('path');
const D = f => path.join(__dirname, '..', 'data', f);
const cfg = require(D('techs.config.js'));
const game = require(D('gametexts.json')).texts;
const data = require(D('units.json'));
const byId = Object.fromEntries(data.units.map(u => [u.id, u]));

const out = cfg.map(c => {
  const names = game[`${c.table}/name_${c.num}`];
  const descs = game[`${c.table}/description_${c.num}`];
  if (!names || !descs) throw new Error('Tech nicht in den Spieltexten: ' + c.key);
  if (!byId[c.unit]) throw new Error('Einheit unbekannt: ' + c.unit);
  [...(c.add || []), ...(c.weaken || [])].forEach(r => { if (!byId[r.a] || !byId[r.b]) throw new Error('Paar unbekannt: ' + c.key); });
  const o = { key: c.key, unit: c.unit, names, descs, level: c.level, gameId: c.num };
  if (c.set) o.set = c.set;
  if (c.add) o.add = c.add;
  if (c.weaken) o.weaken = c.weaken;
  return o;
});
fs.writeFileSync(D('techs.page.json'), JSON.stringify(out, null, 1));

// gleiche Regeln wie auf der Seite
const tgt = u => /both/.test(u.targets) ? 'both' : /air/.test(u.targets) ? 'air' : 'ground';
const flies = u => u.class === 'air' || (u.tags || []).includes('flying');
function flags(u, act) {
  const f = { hitsAir: tgt(u) !== 'ground', hitsGround: tgt(u) !== 'air', flies: flies(u), src: {} };
  out.filter(t => t.unit === u.id && act.has(t.key) && t.set).forEach(t => Object.entries(t.set).forEach(([k, v]) => { f[k] = v; f.src[k] = t; }));
  return f;
}
function breaker(a, b, noAir, act) {
  const fa = flags(a, act), fb = flags(b, act);
  if (fb.flies && !fa.hitsAir) return fa.src.hitsAir || fb.src.flies || 'base';
  if (!fb.flies && !fa.hitsGround) return fa.src.hitsGround || fb.src.flies || 'base';
  if (noAir) {
    if (!fa.flies) return fa.src.flies || 'base';
    if (fb.hitsAir) return fb.src.hitsAir || 'base';
  }
  return null;
}
const pairs = [];
data.units.forEach(u => {
  u.strong.forEach(r => pairs.push([u, byId[r.id], r.noAir]));
  u.weak.forEach(r => pairs.push([byId[r.id], u, r.noAir]));
});
const none = new Set();
const bad = pairs.filter(([a, b, n]) => breaker(a, b, n, none));
console.log('Unstimmige Grund-Konter (ohne Tech):', bad.length ? bad.map(([a, b]) => `${a.id} > ${b.id}`).join(', ') : 'keine');
out.forEach(t => {
  const act = new Set([t.key]);
  const gone = [...new Set(pairs.filter(([a, b, n]) => breaker(a, b, n, act) === t).map(([a, b]) => `${a.id}>${b.id}`))];
  console.log(`${t.key.padEnd(16)} ${t.level.padEnd(8)} entfällt: ${gone.join(', ') || '-'}${t.add ? ' | neu: ' + t.add.map(r => r.a + '>' + r.b).join(', ') : ''}${t.weaken ? ' | geschwächt: ' + t.weaken.map(r => r.a + '>' + r.b).join(', ') : ''}`);
});
