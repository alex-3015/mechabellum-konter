// Liest Einheiten-, Tech- und Tag-Texte in allen 11 Spielsprachen aus resources.assets.
// node scripts/extract/gametexts.js <resources.assets> <out.json>
// Unity-String: int32-Länge + UTF-8, auf 4 Byte ausgerichtet. Nach dem Schlüssel: int32 0, int32 Anzahl, dann die Texte.
const fs = require('fs');
// Spaltenreihenfolge der Spiel-Lokalisierung (aus der Sprachliste in den Spieldateien abgeleitet)
const LANGS = ['en', 'zh-CN', 'ru', 'fr', 'de', 'es', 'ko', 'ja', 'zh-TW', 'es-419', 'pl'];
const [src, out] = process.argv.slice(2);
const buf = fs.readFileSync(src);
const prefix = Buffer.from('ConfigData/');
const wanted = /^ConfigData\/(MechData|TagData|[A-Za-z]*Tech[A-Za-z]*Data)\/(name|description)_\d+$/;
const result = {};
let pos = 0;
while ((pos = buf.indexOf(prefix, pos)) !== -1) {
  const klen = buf.readInt32LE(pos - 4);
  if (klen < 12 || klen > 120) { pos += 11; continue; }
  const key = buf.toString('utf8', pos, pos + klen);
  if (!wanted.test(key)) { pos += 11; continue; }
  let p = (pos + klen + 3) & ~3;
  const count = buf.readInt32LE(p + 4); p += 8;
  if (count !== LANGS.length) { pos += klen; continue; }
  const vals = {};
  for (let i = 0; i < count; i++) {
    const len = buf.readInt32LE(p);
    if (len < 0 || len > 4000) break;
    vals[LANGS[i]] = buf.toString('utf8', p + 4, p + 4 + len);
    p = (p + 4 + len + 3) & ~3;
  }
  const k = key.replace('ConfigData/', '');
  if (!result[k] && Object.keys(vals).length === LANGS.length) result[k] = vals;
  pos += klen;
}
fs.writeFileSync(out, JSON.stringify({ langs: LANGS, texts: result }, null, 1));
console.log('Texte:', Object.keys(result).length, '| Sprachen:', LANGS.join(', '));
