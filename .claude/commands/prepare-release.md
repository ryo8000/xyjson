# Prepare release: bump version, update changelog, and create release branch

## Collect changes

1. Run `git tag -l 'v[0-9]*' --sort=-v:refname | head -1` to find the last version tag.
2. Run `git log --oneline <last-tag>..HEAD` to list commits since last release.
3. Read `package.json` and `CHANGELOG.md`.

## Recommend version and confirm

Determine bump type:
- **major**: `BREAKING CHANGE` in body or `!` suffix (e.g. `feat!:`)
- **minor**: `feat:` commits
- **patch**: fixes, deps, chores, refactors, perf, build, docs only

Show a grouped commit summary and proposed version (e.g. `0.2.3 → 0.2.4 patch`).

**Stop here and wait for user confirmation before proceeding.**

## Update versions

Run `npm version <X.Y.Z> --no-git-tag-version` to update `package.json` and `package-lock.json`.

## Update CHANGELOG.md

Categorize commits; omit empty sections:
- **Added**: `feat:` commits
- **Changed**: `chore:`, `refactor:`, `perf:`, `build:`, bumps, config changes
- **Fixed**: `fix:` commits
- **Removed**: removed features

Rules:
- Exclude `devDependencies` changes.
- Exclude `test:` and `ci:` commits.
- Consolidate `dependencies` updates into one "Updated dependencies:" bullet under **Changed**.
- Replace `## [Unreleased]` with `## [X.Y.Z] - YYYY-MM-DD`, add new empty `## [Unreleased]` above.

## Branch and commit

1. `git checkout -b release/vX.Y.Z`
2. `git add package.json package-lock.json CHANGELOG.md`
3. `git commit -m "chore: release vX.Y.Z"`
4. Report the branch name.
