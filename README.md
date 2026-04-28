# XYJson - XML YAML JSON Converter

Convert **XML ⇄ YAML ⇄ JSON** directly inside VS Code.

- Convert between formats — result opens in a new tab
- Reformat documents in place
- Pretty or minified output via Quick Pick
- Works from Command Palette and right-click menu
- Automatic input format detection

## Features

- Conversion commands — open the result in a new tab, leaving the original untouched:
  - **XYJson: Convert to JSON** - Transform XML or YAML content to JSON
  - **XYJson: Convert to XML** - Transform JSON or YAML content to XML
  - **XYJson: Convert to YAML** - Transform JSON or XML content to YAML
- Format commands — reformat the current document in place:
  - **XYJson: Format JSON** - Reformat JSON content
  - **XYJson: Format XML** - Reformat XML content
  - **XYJson: Format YAML** - Reformat YAML content
- Available from:
  - Command Palette
  - Editor right-click context menu
- Works on the entire document, or just the selected text if a selection is active
- Output format (pretty / minified) selected via Quick Pick on each command
- Automatic input format detection:
  - Content starting with `<` is parsed as XML
  - Content starting with `{` or `[` is parsed as JSON, or YAML if JSON parsing fails (e.g. YAML flow style)
  - All other content is parsed as YAML

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
5. In the Quick Pick dialog, select the output format:
   - **Pretty** – indented with newlines
   - **Minified** – single line, no whitespace

## Settings

| Setting                         | Type    | Default | Description                                                       |
|---------------------------------|---------|---------|-------------------------------------------------------------------|
| `xyjson.xmlAttributeNamePrefix` | string  | `@_`    | Prefix added to XML attribute names when parsing or building XML. |

## License

MIT
