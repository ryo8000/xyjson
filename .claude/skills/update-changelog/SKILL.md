---
name: update-changelog
description: Update CHANGELOG.md from commit history following this repo's Keep a Changelog conventions. Use whenever CHANGELOG.md needs new entries - never edit the changelog ad hoc.
---

# Update CHANGELOG.md

`CHANGELOG.md` follows the [Keep a Changelog](https://keepachangelog.com/) format. New entries go under `## [Unreleased]` (when preparing a release, these will subsequently be renamed to the new version by the `prepare-release` skill).

## Categorize commits

Omit empty sections:

- **Added**: `feat:` commits
- **Changed**: `chore:`, `refactor:`, `perf:`, `build:`, `docs:` commits, dependency bumps, config changes
- **Fixed**: `fix:` commits
- **Removed**: removed features

## Rules

- Dependabot commits look like `Bump <pkg> from <old> to <new>` with no Conventional Commits prefix — treat them as dependency updates.
- Exclude `devDependencies` changes entirely (check which section of `package.json` the bump commit touched, e.g. `git show <sha> -- package.json`).
- Exclude `test:` and `ci:` commits.
- Consolidate runtime `dependencies` updates into a single "Updated dependencies:" bullet under **Changed**, listing each package wrapped in backticks with its transition as a nested sub-bullet indented by two spaces, sorted alphabetically by package name (e.g., "  - `fast-xml-builder` 1.2.0 added" then "  - `fast-xml-parser` from 5.7.3 to 5.8.0").
- Write entries as user-facing descriptions, not commit messages verbatim.
- Keep the existing style: main bullets should end with a period (except "Updated dependencies:" which ends with a colon), while nested sub-bullets (like dependency lists) should not.
