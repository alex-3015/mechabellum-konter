# Mechabellum Konter

Cheat-Sheet für Mechabellum für den zweiten Monitor: Einheit anklicken (oder mit der Maus darüberfahren) und sofort sehen, was sie kontert und wovon sie gekontert wird.

Stand: Patch 2.0.0.4 (14.10.2026), 34 Einheiten.

**Online:** https://alex-3015.github.io/mechabellum-konter/

## Benutzen

Die Seite online aufrufen oder `index.html` direkt im Browser öffnen. Die Datei ist komplett eigenständig (Daten und Bilder sind eingebettet), nur die Schriften kommen von Google Fonts.

- **Grün ▲** kontert die gewählte Einheit, **Rot ▼** wird von ihr gekontert, gestrichelt = Tendenz durch eine Tech.
- Panzer- und Flugzeug-Symbol auf jeder Kachel: trifft Boden / trifft Luft (blass = nein, Akzentfarbe = durch Tech).
- **Hover-Modus:** Auswahl folgt der Maus, ohne Klick.
- **Ansicht-Menü:** Namen DE/EN, Gruppierung nach Klasse oder Ingame-Stufe I–IV, Dunkel/Hell, Größe, Farben für Rot-Grün-Schwäche (Blau/Orange).
- Tippen sucht (deutsch oder englisch), `Enter` wählt, `Esc` oder ein Klick ins Leere hebt die Auswahl auf.
- **Techs:** Bei Einheiten mit Techs, die Luft-/Bodenziele grundsätzlich ändern, lassen sich diese im Panel einschalten. „Belegt“ folgt direkt aus dem Spieltext und den Zieltypen, „Tendenz“ heißt: Richtung belegt, Stärke unbekannt. Reine Zahlen-Buffs sind bewusst nicht berücksichtigt.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html` | Fertige Seite, wird über GitHub Pages ausgeliefert (wird gebaut, nicht direkt bearbeiten) |
| `src/template.html` | Vorlage mit Layout, Styles und Logik |
| `data/units.json` | Einheiten: Namen EN/DE, Kosten, Klasse, Zieltyp, Ingame-Stufe, Konter mit Begründung |
| `data/techs.config.js` | Welche Techs berücksichtigt werden und was sie ändern |
| `data/techs.json` | Alle Tech-Namen und Spieltexte (EN/DE), aus den Spieldateien gelesen |
| `data/techs.page.json` | Aus den beiden vorigen erzeugt, landet in der Seite |
| `data/mechnames.json` | Einheitennamen in allen Sprachen, aus den Spieldateien gelesen |
| `data/icons.json` | Einheitenbilder als data-URIs, aus `icons/` erzeugt |
| `icons/` | Einheitenbilder (112 px) |
| `scripts/` | Build, Tech-Erzeugung, Bild-Daten, lokaler Vorschau-Server, Auslesen der Spieldateien |

## Bauen

Benötigt nur Node.js, keine Pakete.

```bash
npm run all
```

Einzeln: `npm run icons`, `npm run techs`, `npm run build`. Mit `npm run serve` läuft eine Vorschau auf http://127.0.0.1:4317.

## Nach einem Patch aktualisieren

1. Namen und Tech-Texte neu aus der lokalen Installation lesen: `npm run extract:names` und `npm run extract:techs` (Pfad in `package.json` ggf. anpassen).
2. Neue Einheiten in `data/units.json` ergänzen (inkl. `name_de` aus `data/mechnames.json`, `stage` = Ingame-Stufe), Bild als `icons/<id ohne Unterstriche>.jpg` ablegen.
3. Konter und Begründungen prüfen, ggf. `data/techs.config.js` anpassen.
4. `npm run all`.

## Quellen

- Einheiten- und Tech-Namen (DE/EN) sowie Spieltexte: lokale Spieldateien (`resources.assets`).
- Konter: Community-Konsens aus den Wikis (mbwiki.dreamhaven.com, mechabellum.wiki.gg) und Patchnotes.
- Zieltypen, Freischaltkosten und Tech-Zuordnung: mit mbwiki.dreamhaven.com abgeglichen; Ingame-Stufen I–IV aus dem Spiel abgelesen.
- Einheitenbilder: mbwiki.dreamhaven.com (Centurion/Zenturio hat noch kein Bild).

## Mitmachen

Änderungen am `main`-Branch laufen über Pull Requests, die der Repo-Inhaber prüft und freigibt. Direkt pushen kann niemand sonst.

## Hinweis

Inoffizielles Fan-Projekt, nicht mit Game River verbunden. Mechabellum, Einheitennamen, Texte und Bilder gehören Game River.
