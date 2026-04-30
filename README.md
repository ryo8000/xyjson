# XYJson — XML · YAML · JSON Converter

Working with API responses, config files, or legacy XML? Convert between formats and pretty-print or minify your data in seconds — without leaving VS Code.

- **Convert** XML ↔ YAML ↔ JSON, or format (pretty-print / minify) in place
- Works on a selection or the entire document
- Automatic input format detection — no need to specify the source format
- Available from Command Palette and editor right-click menu

## Features

- Conversion commands — open the result in a new tab, leaving the original untouched:
  - **XYJson: Convert to JSON** — from XML or YAML
  - **XYJson: Convert to XML** — from JSON or YAML
  - **XYJson: Convert to YAML** — from JSON or XML
- Format commands — reformat the current document in place:
  - **XYJson: Format JSON**
  - **XYJson: Format XML**
  - **XYJson: Format YAML**
- Works on the entire document, or just the selected text if a selection is active
- Output format (pretty / minified) selected via Quick Pick on each command
- Automatic input format detection:
  - Content starting with `<` → parsed as XML
  - Content starting with `{` or `[` → parsed as JSON (falls back to YAML for YAML flow style)
  - Everything else → parsed as YAML

## Usage

1. Open an XML, JSON, or YAML file
2. Optionally, select a portion of text to convert only that range
3. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) or right-click in the editor
4. Select a command:
   - **XYJson: Convert to JSON / XML / YAML** — opens the result in a new tab
   - **XYJson: Format JSON / XML / YAML** — reformats in place (shown only for matching file type)
5. Choose the output style in the Quick Pick:
   - **Pretty** — indented with newlines
   - **Minified** — single line, no whitespace

## Settings

| Setting                         | Type    | Default | Description                                                                                        |
|---------------------------------|---------|---------|----------------------------------------------------------------------------------------------------|
| `xyjson.indentSize`             | integer | `2`     | Number of spaces used for indentation when pretty-formatting XML/YAML/JSON output. Min: 1, Max: 8. |
| `xyjson.xmlAttributeNamePrefix` | string  | `@_`    | Prefix added to XML attribute names when parsing or building XML.                                  |

## License

MIT
