# XYJson - XML YAML JSON Converter

Convert **XML ⇄ YAML ⇄ JSON** directly inside VS Code.

- Convert between formats with one command
- Pretty format or minify output
- Works from Command Palette and right-click menu
- Automatic input format detection

## Features

- Conversion commands:
  - **XYJson: Convert to JSON** - Transform XML or YAML content to JSON
  - **XYJson: Convert to XML** - Transform JSON or YAML content to XML
  - **XYJson: Convert to YAML** - Transform JSON or XML content to YAML
- Format commands (same-format reformatting):
  - **XYJson: Format JSON** - Reformat JSON content
  - **XYJson: Format XML** - Reformat XML content
  - **XYJson: Format YAML** - Reformat YAML content
- Available from:
  - Command Palette
  - Editor right-click context menu
- Automatic input format detection:
  - Content starting with `<` is parsed as XML
  - Content starting with `{` or `[` is parsed as JSON, or YAML if JSON parsing fails (e.g. YAML flow style)
  - All other content is parsed as YAML
- Convert the entire document, or just the selected text if a selection is active
- Output format (pretty / minified) selected via Quick Pick on each command

## Usage

1. Open an XML, JSON, or YAML file
2. Optionally, select a portion of text to convert only that range
3. Right-click in the editor to open the context menu
4. Select one of the conversion commands:
   - **XYJson: Convert to JSON**
   - **XYJson: Convert to XML**
   - **XYJson: Convert to YAML**
   - **XYJson: Format JSON** (shown only when editing a JSON file)
   - **XYJson: Format XML** (shown only when editing an XML file)
   - **XYJson: Format YAML** (shown only when editing a YAML file)

If text is selected, only the selection is replaced with the converted result.
If nothing is selected, the entire document is replaced.

## Settings

| Setting                         | Type    | Default | Description                                                       |
|---------------------------------|---------|---------|-------------------------------------------------------------------|
| `xyjson.xmlAttributeNamePrefix` | string  | `@_`    | Prefix added to XML attribute names when parsing or building XML. |

## License

MIT
