# XYJson Claude Code Operating Instructions

## Project context
- This repository is a VS Code extension that converts XML/YAML/JSON.
- Core implementation lives in `src/converter.ts` and `src/extension.ts`.
- Tests live in `src/test/` and fixtures are copied by `npm run copy-fixtures`.

## Working rules
- For multi-file or ambiguous changes, use **Plan Mode** first.
- Before coding, identify impacted files and expected behavior in bullet points.
- For any bug fix, prefer adding or updating tests in `src/test/`.
- Keep changes focused; avoid unrelated refactors.

## Validation checklist (run after edits)
1. `npm run compile`
2. `npm run lint`
3. `npm run copy-fixtures`
4. `npm test` — unit tests only, no VS Code runtime required
5. `npm run test:integration` — full tests including VS Code integration tests (requires VS Code runtime)

## Repository conventions
- Use TypeScript and existing coding style in `src/`.
- Preserve public command IDs in `package.json`:
  - `xyjson.toJson`
  - `xyjson.toXml`
  - `xyjson.toYaml`
  - `xyjson.formatJson`
  - `xyjson.formatXml`
  - `xyjson.formatYaml`
- Keep user-facing behavior aligned with README settings and usage docs.

## PR/commit expectations
- Include a concise summary and explicit test commands run.
- If a check cannot run due to environment limits, state it clearly.
