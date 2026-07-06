---
name: update-changelog
description: Update CHANGELOG.md from commit history following this repo's Keep a Changelog conventions. Use whenever CHANGELOG.md needs new entries - never edit the changelog ad hoc.
---

# Update CHANGELOG.md

`CHANGELOG.md` follows the [Keep a Changelog](https://keepachangelog.com/) format. New entries go under `## [Unreleased]` unless a release version is being cut (then see the `prepare-release` skill).

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
- Consolidate runtime `dependencies` updates into a single "Updated dependencies:" bullet under **Changed**, listing each package with its transition (e.g., "from X to Y" or "X added").
- Write entries as user-facing descriptions, not commit messages verbatim.
- Keep the existing style: main bullets should end with a period, while nested sub-bullets (like dependency lists) should not.
