# Mechabellum Counters

[Deutsch](README.md) · **English**

A Mechabellum cheat sheet for your second monitor: click a unit (or hover over it) and instantly see what it counters and what counters it.

Status: patch 2.0.0.4 (Oct 14, 2026), 34 units, 11 languages.

**Online:** https://alex-3015.github.io/mechabellum-konter/

## Usage

Open the page online or open `index.html` directly in your browser. The file is fully self-contained (data, images and all languages are embedded); only the fonts come from Google Fonts.

- **Green ▲** counters the selected unit, **red ▼** is countered by it, dashed = tendency caused by a tech.
- Tank and plane icons on every tile: hits ground / hits air (faded = no, accent color = because of a tech).
- **Hover mode:** the selection follows your mouse, no click needed.
- **View menu:**
  - **Language:** English, German, French, Spanish (Spain), Spanish (Latin America), Polish, Russian, Japanese, Korean, Chinese (Simplified), Chinese (Traditional). On your first visit the page uses your browser language.
  - **Groups:** by class, or by tier I–IV like in the game.
  - **Theme:** dark or light.
  - **Size:** normal or large.
  - **Colors:** green/red, blue/orange (red-green color blindness) or teal/red (blue-yellow color blindness).
  - **Sidebar:** show or hide the detail panel (the grid then uses the full width).
- Typing searches in all languages, `Enter` selects, `Esc` or clicking an empty area clears the selection.
- **Techs:** for units with techs that fundamentally change air/ground targeting, you can switch them on in the panel. “Confirmed” follows directly from the game's tech text and the target types; “tendency” means the direction is confirmed but the strength is unknown. Pure stat buffs are deliberately left out.

## Languages and translations

- Unit and tech names come from the game itself in every language (`data/gametexts.json`, read from the game files). Texts reference them as placeholders `{u:<unit>}` and `{t:<tech>}`.
- Spanish exists twice because the game uses different names in Spain and Latin America (e.g. Crawler: “Musaraña” vs. “Rastrero”).
- The source language is German (`i18n/de.json`). The other language files were translated with AI, using the game's own terminology (`i18n/glossary.json`).
- **Rule:** every text change or addition must be applied to all languages listed in `i18n/languages.json`. See [CLAUDE.md](CLAUDE.md) and [CONTRIBUTING.md](CONTRIBUTING.md). `npm run check` verifies this, and the same check runs in GitHub Actions on every pull request.

## Structure

| Path | Contents |
|---|---|
| `index.html` | Finished page, served via GitHub Pages (built, do not edit by hand) |
| `src/template.html` | Template with layout, styles and logic |
| `i18n/languages.json` | Supported languages (source language: German) |
| `i18n/<language>.json` | All texts per language: UI, reasons, tags, notes, tech effects |
| `i18n/glossary.json` | Game terms per language as a translation aid |
| `data/units.json` | Units (language-neutral): cost, class, target type, in-game tier, counters |
| `data/gametexts.json` | The game's unit, tech and tag texts in all 11 languages |
| `data/techs.config.js` | Which techs are covered and what they change |
| `data/techrefs.json` | Tech names referenced in texts as `{t:…}` |
| `data/techs.page.json`, `data/icons.json` | Generated, embedded into the page |
| `icons/` | Unit images (112 px) |
| `scripts/` | Build, language check, tech generation, image data, preview server, game file extraction |
| `.github/workflows/check.yml` | Check on every pull request (languages, up-to-date `index.html`) |
| `.github/workflows/claude-code-review.yml` | Claude Code Review: comments findings directly on the pull request |

## Building

Only Node.js is required, no packages.

```bash
npm run all
```

Individually: `npm run check` (check languages), `npm run icons`, `npm run techs`, `npm run build`. `npm run dev` also builds with incomplete languages (for local work in progress only). `npm run serve` starts a preview at http://127.0.0.1:4317.

## Updating after a patch

1. Re-read the game texts from your local installation: `npm run extract:texts` (adjust the path in `package.json` if needed).
2. Add new units to `data/units.json` (`stage` = in-game tier) and put the image at `icons/<id without underscores>.jpg`.
3. Review the counters and add or update their texts in **all** language files.
4. `npm run check` and `npm run all`.

## Contributing

Changes to the `main` branch go through pull requests that only the repository owner can merge. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Sources

- Unit and tech names and game texts (all languages): local game files (`resources.assets`).
- Counters: community consensus from the wikis (mbwiki.dreamhaven.com, mechabellum.wiki.gg) and patch notes.
- Target types, unlock costs and tech assignment: cross-checked with mbwiki.dreamhaven.com; in-game tiers I–IV taken from the game.
- Unit images: mbwiki.dreamhaven.com (Centurion has no image yet).

## Disclaimer

Unofficial fan project, not affiliated with Game River. Mechabellum, unit names, texts and images belong to Game River.
