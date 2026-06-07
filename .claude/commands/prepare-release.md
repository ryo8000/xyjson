# Update CHANGELOG.md for a new release

**Stop at Step 2 for user confirmation before continuing.**

## Collect changes

1. Run `git tag --sort=-v:refname | head -1` to find the last version tag.
2. Run `git log --oneline <last-tag>..HEAD` to list commits since last release.
3. Read `package.json` and `CHANGELOG.md`.

## Recommend version and confirm

Determine bump type:
- **major**: `BREAKING CHANGE` in body or `!` suffix (e.g. `feat!:`)
- **minor**: `feat:` commits
- **patch**: fixes, deps, chores, docs only

Show a grouped commit summary and proposed version (e.g. `0.2.3 → 0.2.4 patch`). **Wait for user confirmation before proceeding.**

## Update versions

1. Set `version` in `package.json` to the confirmed version.
2. Run `npm install` to update `package-lock.json`.

## Update CHANGELOG.md

Categorize commits; omit empty sections:
- **Added**: `feat:` commits
- **Changed**: `chore:`, bumps, config changes
- **Fixed**: `fix:` commits
- **Removed**: removed features

Rules:
- Exclude `devDependencies` changes.
- Consolidate `dependencies` updates into one "Updated dependencies:" bullet under **Changed**.
- Replace `## [Unreleased]` with `## [X.Y.Z] - YYYY-MM-DD`, add new empty `## [Unreleased]` above.

## Branch and commit

1. `git checkout -b release/vX.Y.Z`
2. `git add package.json package-lock.json CHANGELOG.md`
3. `git commit -m "chore: release vX.Y.Z"`
4. Report the branch name.
