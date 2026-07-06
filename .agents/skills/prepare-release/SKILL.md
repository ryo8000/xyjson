---
name: prepare-release
description: Prepare a release - determine the next version from commits, bump package.json, update CHANGELOG.md, and create a release branch. Use when the user asks to prepare, cut, or start a release.
---

# Prepare release

## Collect changes

1. Run `git tag -l 'v[0-9]*' --sort=-v:refname | head -1` to find the last version tag. If no tag exists, use all commits.
2. Run `git log --oneline <last-tag>..HEAD` (or `git log --oneline` if no tag exists) to list commits since last release.
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

Follow the `update-changelog` skill (`.claude/skills/update-changelog/SKILL.md`) to categorize the collected commits, then replace `## [Unreleased]` with `## [X.Y.Z] - YYYY-MM-DD` and add a new empty `## [Unreleased]` section above it.

## Branch and commit

1. `git checkout -b release/vX.Y.Z`
2. `git add package.json package-lock.json CHANGELOG.md`
3. `git commit -m "chore: release vX.Y.Z"`
4. Report the branch name.
