---
name: verify
description: Verify a change to this VS Code extension end-to-end - which tests to run for which change (unit vs integration tests) and how to launch and exercise the extension manually. Use before committing, when running or checking the extension, when asked to run integration tests, or when launching the Extension Development Host (F5).
---

# Verifying changes to XYJson

## Pick the right level

| What changed | Minimum verification |
|---|---|
| Only `src/converter.ts` and/or `src/test/unit/` | `npm test` (fast local check; CI still runs the full suite on push since `src/` falls under its `check-changes` filter) |
| Anything else matched by the `check-changes` file filter in `.github/workflows/ci.yml` | `npm test` and `npm run test:integration` |
| Everything else | Nothing to run (no linters are configured for these files) |

## Commands

- `npm test` — unit tests; `pretest` also runs type-check, lint, and the build, so a green run proves the build too.
- `npm run test:integration` — runs unit and integration tests together inside a real VS Code instance. Slow on first run (downloads VS Code).

## Manual check (Extension Development Host)

Requires a human at the VS Code GUI — a CLI agent cannot press `F5`; run the integration tests instead. The integration suite already exercises Quick Pick branching, output placement, and format commands, so only check what it can't: context menu visibility/labels and the real Quick Pick UI. Press `F5`, open an XML/JSON/YAML file, and run `XYJson: ...` commands from the Command Palette and editor context menu.
