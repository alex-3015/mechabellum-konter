# Mitmachen / Contributing

## Deutsch

Danke fürs Mithelfen! Bitte beachte die Regeln in [CLAUDE.md](CLAUDE.md). Die wichtigste:

**Jede Text-Änderung oder -Erweiterung muss in allen Sprachen aus `i18n/languages.json` umgesetzt werden.** Quellsprache ist Deutsch (`i18n/de.json`). Einheiten- und Tech-Namen werden als Platzhalter (`{u:…}`, `{t:…}`) eingesetzt und kommen in jeder Sprache aus dem Spiel.

Vor dem Pull Request:

```bash
npm run check
npm run all
```

`npm run check` muss fehlerfrei durchlaufen, und die neu gebaute `index.html` gehört mit in den Pull Request. Änderungen an `main` laufen nur über Pull Requests, die der Repo-Inhaber prüft und mergt.

## English

Thanks for helping! Please follow the rules in [CLAUDE.md](CLAUDE.md). The most important one:

**Every text change or addition must be applied to all languages listed in `i18n/languages.json`.** The source language is German (`i18n/de.json`). Unit and tech names are inserted as placeholders (`{u:…}`, `{t:…}`) and come from the game in every language.

Before opening a pull request:

```bash
npm run check
npm run all
```

`npm run check` must pass without errors, and the rebuilt `index.html` belongs in the pull request. Changes to `main` only go through pull requests that the repository owner reviews and merges.
