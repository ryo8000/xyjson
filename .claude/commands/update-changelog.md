# Update CHANGELOG.md for a new release

Follow these steps to update `CHANGELOG.md` for a new version release:

1. Read the current `CHANGELOG.md` to understand its structure.
2. Read `package.json` to confirm the new version number.
3. Run `git log --oneline vX.Y.Z..HEAD` (where `vX.Y.Z` is the previous version tag) to collect all commits since the last release.
4. Based on the commits, categorize changes into:
   - **Added**: new features (feat: commits)
   - **Changed**: updates, dependency bumps, config changes (`chore:` commits and dependency bump commits)
   - **Fixed**: bug fixes (fix: commits)
   - **Removed**: removed features
   Only include sections that have entries.
5. Exclude any changes related to `devDependencies` — these are internal development tools not relevant to users and should not appear in any section. For updates to `dependencies` in `package.json`, consolidate them under a single "Updated dependencies:" bullet in the **Changed** section.
6. Replace the `## [Unreleased]` section with a new versioned section `## [X.Y.Z] - YYYY-MM-DD` (use today's date), keeping an empty `## [Unreleased]` above it.
7. Write the updated `CHANGELOG.md`.
