# Projektregeln: Mechabellum Konter

Diese Regeln gelten für alle Änderungen an diesem Repository, egal ob von Menschen oder KI-Assistenten.

## Mehrsprachigkeit (verbindlich)

- Die unterstützten Sprachen stehen in `i18n/languages.json` (derzeit 11: en, de, fr, es, es-419, pl, ru, ja, ko, zh-CN, zh-TW). Quellsprache ist Deutsch (`i18n/de.json`).
- **Jede Änderung oder Erweiterung eines Textes muss im selben Pull Request in allen Sprachen aus `i18n/languages.json` nachgezogen werden.** Das gilt für Oberfläche, Konter-Begründungen, Tags, Hinweise, Tech-Wirkungen und die Infos in der Fußzeile. Keine Sprache darf fehlen oder veralten.
  - Neuer Text: zuerst den Schlüssel in `i18n/de.json` anlegen, dann in jeder anderen Sprachdatei übersetzen.
  - Geänderter deutscher Text: die Übersetzung dieses Schlüssels in allen anderen Dateien prüfen und anpassen.
  - Gelöschter Text: den Schlüssel aus allen Dateien entfernen.
  - Neue Konter-Beziehung, neuer Tag, neuer Hinweis oder neue Tech in den Daten: Die Texte sind Pflicht (`why.s.*`, `why.w.*`, `tag.*`, `note.*`, `tech.*`).
- Einheiten- und Tech-Namen werden nie ausgeschrieben, sondern als Platzhalter `{u:<einheiten-id>}` bzw. `{t:<ref>}` eingesetzt. Die Seite füllt sie mit dem offiziellen Namen aus dem Spiel (`data/gametexts.json`). Für einen neuen Tech-Namen im Text kommt ein Eintrag in `data/techrefs.json`.
- Begriffe folgen dem Wortlaut des Spiels in der jeweiligen Sprache (`i18n/glossary.json`, `data/gametexts.json`). Spanisch gibt es zweimal (`es` Spanien, `es-419` Lateinamerika), weil das Spiel dort unterschiedliche Namen und Begriffe verwendet.
- Platzhalter (`{name}`, `{n}`, `{u:…}`, `{t:…}` …) bleiben in jeder Übersetzung unverändert erhalten.
- Eine neue Sprache braucht einen Eintrag in `i18n/languages.json`, eine vollständige Sprachdatei und eine passende Spalte in den Spieltexten.

**Prüfung:** `npm run check` prüft Vollständigkeit, Platzhalter und Datenbezüge. Derselbe Check läuft in GitHub Actions bei jedem Pull Request und ist für `main` Pflicht. Fehlt ein Text in einer Sprache, schlägt der Check fehl.

## Weitere Regeln

- `index.html` wird mit `npm run all` gebaut und nie von Hand bearbeitet. Die committete `index.html` muss zum Quellstand passen, auch das prüft die CI.
- `main` ist geschützt: Änderungen nur per Pull Request, Merges nur durch den Repo-Inhaber.
- Konter-Regeln für Techs sind sprachunabhängig (`noAir`-Merkmal in `data/units.json`, `set`/`add`/`weaken` in `data/techs.config.js`).
