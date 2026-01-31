# Change Log

## [Unreleased]

## [0.0.3] - 2026-01-31

### Added

- Keywords for better discoverability in the VS Code Marketplace.

### Changed

- Updated dependencies:
  - `fast-xml-parser` from 5.3.3 to 5.3.4
  - `typescript-eslint` from 8.53.1 to 8.54.0
  - `@types/node` from 25.0.10 to 25.1.0

## [0.0.2] - 2026-01-27

### Added

- User-configurable settings:
  - `xyjson.minify` — Control whether the output should be minified or formatted (default: `false`).
- Pretty-formatted output for JSON, XML, and YAML when `minify` is disabled.

### Changed

- Conversion output is now formatted by default instead of minified.

## [0.0.1] - 2026-01-24

### Added

- Conversion commands:
  - `Convert to JSON` — Convert current document to JSON
  - `Convert to XML` — Convert current document to XML
  - `Convert to YAML` — Convert current document to YAML
