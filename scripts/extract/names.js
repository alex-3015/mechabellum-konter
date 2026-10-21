// Liest ConfigData/MechData/name_* aus resources.assets (Unity: int32-Länge + UTF-8 + Ausrichtung auf 4)
const fs = require('fs');
const buf = fs.readFileSync(process.argv[2]);
const prefix = Buffer.from('ConfigData/MechData/name_');
const out = {};
let pos = 0;
while ((pos = buf.indexOf(prefix, pos)) !== -1) {
  const klen = buf.readInt32LE(pos - 4);
  const key = buf.toString('utf8', pos, pos + klen);
  let p = pos + klen; p = (p + 3) & ~3;
  const vals = [];
  const count = buf.readInt32LE(p + 4); p += 8;
  for (let i = 0; i < count && count < 20; i++) {
    const len = buf.readInt32LE(p);
    if (len < 0 || len > 400) break;
    vals.push(buf.toString('utf8', p + 4, p + 4 + len));
    p = ((p + 4 + len) + 3) & ~3;
  }
  if (!out[key]) out[key] = vals;
  pos += klen;
}
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
Object.entries(out).forEach(([k, v]) => console.log(k.replace('ConfigData/MechData/name_', '').padEnd(5), '|', v[0], '|', v[4], '| n=' + v.length));
