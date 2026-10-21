// Alle Tech-Namen + Beschreibungen (EN/DE) einsammeln, nach Name zusammenfassen und grob klassifizieren
const fs = require('fs');
const buf = fs.readFileSync(process.argv[2]);
const prefix = Buffer.from('ConfigData/');
const entries = {};
let pos = 0;
while ((pos = buf.indexOf(prefix, pos)) !== -1) {
  const klen = buf.readInt32LE(pos - 4);
  if (klen < 12 || klen > 120) { pos += 11; continue; }
  const key = buf.toString('utf8', pos, pos + klen);
  const m = /^ConfigData\/([A-Za-z]*Tech[A-Za-z]*Data)\/(name|description)_(\d+)$/.exec(key);
  if (!m) { pos += 11; continue; }
  let p = (pos + klen + 3) & ~3;
  const count = buf.readInt32LE(p + 4); p += 8;
  const vals = [];
  for (let i = 0; i < count && count < 20; i++) {
    const len = buf.readInt32LE(p);
    if (len < 0 || len > 4000) break;
    vals.push(buf.toString('utf8', p + 4, p + 4 + len));
    p = (p + 4 + len + 3) & ~3;
  }
  const id = m[1] + '#' + m[3];
  entries[id] = entries[id] || { table: m[1], num: m[3] };
  entries[id][m[2]] = vals[0]; entries[id][m[2] + '_de'] = vals[4];
  pos += klen;
}
const byName = {};
Object.values(entries).filter(e => e.name).forEach(e => {
  const k = e.name + ' | ' + (e.description || '');
  (byName[k] = byName[k] || { ...e, nums: [] }).nums.push(e.num);
});
const list = Object.values(byName);
const rules = [
  ['Ziel Luft/Boden', /aerial|air unit|against air|cannot target air|target air|anti-air|flying/i],
  ['wird Lufteinheit', /becomes? (an )?(aerial|air)|take(s)? flight|fly/i],
  ['Flächenschaden', /splash|area|radius|chain/i],
  ['Raketenabwehr/Tarnung', /intercept|missile|stealth|invisib/i],
];
const cls = {};
list.forEach(e => {
  const hit = rules.filter(([, re]) => re.test(e.description || '')).map(([n]) => n);
  e.kind = hit.length ? hit.join(', ') : 'Zahlenwert / Sonstiges';
  (cls[e.kind] = cls[e.kind] || []).push(e);
});
console.log('Eindeutige Techs (Name+Beschreibung):', list.length, '| Rohtexte:', Object.keys(entries).length);
Object.entries(cls).sort((a, b) => b[1].length - a[1].length).forEach(([k, v]) => console.log(`  ${k}: ${v.length}`));
console.log('\nBeispiele grundsätzlicher Änderungen:');
list.filter(e => /Ziel Luft|wird Luft/.test(e.kind)).slice(0, 18).forEach(e =>
  console.log(`- ${e.name} / ${e.name_de}: ${(e.description || '').slice(0, 130)}`));
fs.writeFileSync(process.argv[3], JSON.stringify(list, null, 1));
