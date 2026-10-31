# XYJson Agent Instructions

## Project context
- This repository is a VS Code extension that converts XML/YAML/JSON.
- Core implementation lives in `src/converter.ts`, `src/extension.ts`, and `src/extensionCore.ts`.
- Tests live in `src/test/` and fixtures are copied by `npm run copy-fixtures`.

## Working rules
- For multi-file or ambiguous changes, list the impacted files and expected behavior before editing.
- For any bug fix, prefer adding or updating tests in `src/test/`.

## Repository conventions
- Preserve public command IDs in `package.json`:
  - `xyjson.toJson`
  - `xyjson.toXml`
  - `xyjson.toYaml`
  - `xyjson.formatJson`
  - `xyjson.formatXml`
  - `xyjson.formatYaml`
  - `xyjson.clipboardToJson`
  - `xyjson.clipboardToXml`
  - `xyjson.clipboardToYaml`
- Keep user-facing behavior aligned with README settings and usage docs.
