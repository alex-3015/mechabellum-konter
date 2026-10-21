# Mechabellum Konter

**Deutsch** · [English](README.en.md)

Cheat-Sheet für Mechabellum für den zweiten Monitor: Einheit anklicken (oder mit der Maus darüberfahren) und sofort sehen, was sie kontert und wovon sie gekontert wird.

Stand: Patch 2.0.0.4 (14.10.2026), 34 Einheiten, 11 Sprachen.

**Online:** https://alex-3015.github.io/mechabellum-konter/

## Benutzen

Die Seite online aufrufen oder `index.html` direkt im Browser öffnen. Die Datei ist komplett eigenständig (Daten, Bilder und alle Sprachen sind eingebettet), nur die Schriften kommen von Google Fonts.

- **Grün ▲** kontert die gewählte Einheit, **Rot ▼** wird von ihr gekontert, gestrichelt = Tendenz durch eine Tech.
- Panzer- und Flugzeug-Symbol auf jeder Kachel: trifft Boden / trifft Luft (blass = nein, Akzentfarbe = durch Tech).
- **Hover-Modus:** Auswahl folgt der Maus, ohne Klick.
- **Ansicht-Menü:**
  - **Sprache:** Englisch, Deutsch, Französisch, Spanisch (Spanien), Spanisch (Lateinamerika), Polnisch, Russisch, Japanisch, Koreanisch, Chinesisch (vereinfacht), Chinesisch (traditionell). Beim ersten Besuch wird die Browsersprache übernommen.
  - **Gruppen:** nach Klasse oder wie im Spiel nach Stufe I–IV.
  - **Design:** Dunkel oder Hell.
  - **Größe:** Normal oder Groß.
  - **Farben:** Grün/Rot, Blau/Orange (Rot-Grün-Schwäche) oder Türkis/Rot (Blau-Gelb-Schwäche).
  - **Seitenleiste:** Detail-Panel anzeigen oder ausblenden (das Raster nutzt dann die volle Breite).
- Tippen sucht in allen Sprachen, `Enter` wählt, `Esc` oder ein Klick ins Leere hebt die Auswahl auf.
- **Techs:** Bei Einheiten mit Techs, die Luft-/Bodenziele grundsätzlich ändern, lassen sich diese im Panel einschalten. „Belegt“ folgt direkt aus dem Spieltext und den Zieltypen, „Tendenz“ heißt: Richtung belegt, Stärke unbekannt. Reine Zahlen-Buffs sind bewusst nicht berücksichtigt.

## Sprachen und Übersetzungen

- Einheiten- und Tech-Namen kommen in jeder Sprache aus dem Spiel selbst (`data/gametexts.json`, aus den Spieldateien gelesen). In den Texten stehen sie als Platzhalter `{u:<einheit>}` und `{t:<tech>}`.
- Spanisch gibt es zweimal, weil das Spiel in Spanien und Lateinamerika unterschiedliche Namen verwendet (z. B. Crawler: „Musaraña“ bzw. „Rastrero“).
- Quellsprache ist Deutsch (`i18n/de.json`). Die anderen Sprachdateien wurden mit KI übersetzt, Begriffe nach dem Wortlaut des Spiels (`i18n/glossary.json`).
- **Regel:** Jede Text-Änderung oder -Erweiterung muss in allen Sprachen aus `i18n/languages.json` umgesetzt werden. Details in [CLAUDE.md](CLAUDE.md) und [CONTRIBUTING.md](CONTRIBUTING.md). `npm run check` prüft das, und dieselbe Prüfung läuft bei jedem Pull Request in GitHub Actions.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html` | Fertige Seite, wird über GitHub Pages ausgeliefert (wird gebaut, nicht direkt bearbeiten) |
| `src/template.html` | Vorlage mit Layout, Styles und Logik |
| `i18n/languages.json` | Die unterstützten Sprachen (Quellsprache: Deutsch) |
| `i18n/<sprache>.json` | Alle Texte je Sprache: Oberfläche, Begründungen, Tags, Hinweise, Tech-Wirkungen |
| `i18n/glossary.json` | Spielbegriffe je Sprache als Hilfe beim Übersetzen |
| `data/units.json` | Einheiten (sprachneutral): Kosten, Klasse, Zieltyp, Ingame-Stufe, Konter |
| `data/gametexts.json` | Einheiten-, Tech- und Tag-Texte des Spiels in allen 11 Sprachen |
| `data/techs.config.js` | Welche Techs berücksichtigt werden und was sie ändern |
| `data/techrefs.json` | Tech-Namen, die in Texten als `{t:…}` vorkommen |
| `data/techs.page.json`, `data/icons.json` | Daraus erzeugt, landen in der Seite |
| `icons/` | Einheitenbilder (112 px) |
| `scripts/` | Build, Sprachprüfung, Tech-Erzeugung, Bild-Daten, Vorschau-Server, Auslesen der Spieldateien |
| `.github/workflows/check.yml` | Prüfung bei jedem Pull Request |

## Bauen

Benötigt nur Node.js, keine Pakete.

```bash
npm run all
```

Einzeln: `npm run check` (Sprachen prüfen), `npm run icons`, `npm run techs`, `npm run build`. `npm run dev` baut auch mit unvollständigen Sprachen (nur für lokale Zwischenstände). Mit `npm run serve` läuft eine Vorschau auf http://127.0.0.1:4317.

## Nach einem Patch aktualisieren

1. Spieltexte neu aus der lokalen Installation lesen: `npm run extract:texts` (Pfad in `package.json` ggf. anpassen).
2. Neue Einheiten in `data/units.json` ergänzen (`stage` = Ingame-Stufe), Bild als `icons/<id ohne Unterstriche>.jpg` ablegen.
3. Konter prüfen und die Texte dafür in **allen** Sprachdateien ergänzen bzw. anpassen.
4. `npm run check` und `npm run all`.

## Mitmachen

Änderungen am `main`-Branch laufen über Pull Requests, die nur der Repo-Inhaber mergen kann. Siehe [CONTRIBUTING.md](CONTRIBUTING.md).

## Quellen

- Einheiten- und Tech-Namen sowie Spieltexte (alle Sprachen): lokale Spieldateien (`resources.assets`).
- Konter: Community-Konsens aus den Wikis (mbwiki.dreamhaven.com, mechabellum.wiki.gg) und Patchnotes.
- Zieltypen, Freischaltkosten und Tech-Zuordnung: mit mbwiki.dreamhaven.com abgeglichen; Ingame-Stufen I–IV aus dem Spiel abgelesen.
- Einheitenbilder: mbwiki.dreamhaven.com (Centurion hat noch kein Bild).

## Hinweis

Inoffizielles Fan-Projekt, nicht mit Game River verbunden. Mechabellum, Einheitennamen, Texte und Bilder gehören Game River.
