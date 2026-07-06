---
name: verify
description: Verify a change to this VS Code extension end-to-end - which tests to run for which change (unit vs integration tests) and how to launch and exercise the extension manually. Use before committing, when running or checking the extension, when asked to run integration tests, or when launching the Extension Development Host (F5).
---

# Verifying changes to XYJson

## Pick the right level

| What changed | Minimum verification |
|---|---|
| `src/converter.ts` or unit tests | `npm test` |
| `src/extension.ts`, `package.json` (`contributes`), integration tests | `npm test` and `npm run test:integration` |
| Docs/config only (`README`, `CHANGELOG`, `.github/`, `.claude/`) | Nothing to run (no linters are configured for these files) |

## Commands

- `npm test` — unit tests (mocha, tdd UI). `pretest` runs type-check, lint, esbuild bundle, and fixture copy first, so a green run also proves the build.
- `npm run test:integration` — launches a downloaded VS Code and runs `src/test/integration/extension.test.ts` against the real editor (registers commands, executes conversions, checks documents). Slow on first run (VS Code download to `.vscode-test/`).

Both suites passing is the strongest automated signal; the integration suite covers every command ID and the `xyjson.*` settings.

## Manual check (Extension Development Host)

When behavior needs to be seen rather than asserted (Quick Pick flow, context menu visibility, clipboard commands):

1. Run `npm run compile` (or `npm run watch` for iteration).
2. Launch the Extension Development Host: `F5` in VS Code (uses `.vscode/launch.json`, preLaunchTask builds via `npm: watch`). From a terminal-only session, prefer the integration tests instead — they drive the same code paths headlessly.
3. In the dev host, open or create an XML/JSON/YAML file, then run `XYJson: ...` commands from the Command Palette or the editor context menu.
4. Check: correct output format, pretty/minified Quick Pick (when `xyjson.outputStyle` is `ask`), result placement per `xyjson.convertOutput`, and in-place edits for Format commands.
