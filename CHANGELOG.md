# Change Log

## [Unreleased]

## [0.0.10] - 2026-04-30

### Added

- New Format JSON, Format XML, and Format YAML commands for same-format reformatting.
- New `xyjson.indentSize` setting to configure the number of spaces used for indentation (default: `2`).

### Changed

- Replaced `xyjson.minify` setting with a Quick Pick dialog for selecting formatting options at conversion time.
- Conversion result now opens in a new tab instead of overwriting the current editor.
- Command palette entries are now filtered by the active file's language.
- Updated minimum VS Code engine version to 1.116.0.
- Updated dependencies:
  - `fast-xml-parser` from 5.6.0 to 5.7.1

### Fixed

- Guard against stale editor state when the Quick Pick dialog is closed.

## [0.0.9] - 2026-04-25

### Fixed

- Fix YAML flow style input being misdetected as JSON.

### Changed

- Updated dependencies:
  - `fast-xml-parser` from 5.5.7 to 5.6.0

## [0.0.8] - 2026-03-23

### Added

- Support selection-scoped conversion: when text is selected, only the selected portion is converted.

### Changed

- Updated dependencies:
  - `fast-xml-parser` from 5.4.2 to 5.5.7

## [0.0.7] - 2026-03-11

### Added

- New `xyjson.xmlAttributeNamePrefix` setting to configure the prefix added to XML attribute names when parsing or building XML (default: `@_`).

### Changed

- Updated command titles to include the `XYJson:` prefix for better discoverability in the Command Palette.
- Updated dependencies:
  - `fast-xml-parser` from 5.3.8 to 5.4.2

## [0.0.6] - 2026-02-27

### Changed

- Updated extension display name to "XYJson - XML YAML JSON Converter".
- Updated extension description.
- Added `Formatters` to extension categories.
- Updated keywords for better discoverability in the VS Code Marketplace.
- Updated `.vscodeignore` to exclude `scripts/` directory.
- Updated dependencies:
  - `fast-xml-parser` from 5.3.7 to 5.3.8

## [0.0.5] - 2026-02-23

### Changed

- Updated dependencies:
  - `fast-xml-parser` from 5.3.5 to 5.3.7

## [0.0.4] - 2026-02-18

### Changed

- Updated minimum VS Code engine version from 1.108.0 to 1.109.0.
- Updated `.vscodeignore` to exclude test output files.
- Updated dependencies:
  - `fast-xml-parser` from 5.3.4 to 5.3.5

## [0.0.3] - 2026-01-31

### Added

- Keywords for better discoverability in the VS Code Marketplace.

### Changed

- Updated dependencies:
  - `fast-xml-parser` from 5.3.3 to 5.3.4

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
