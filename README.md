# XYJson - XML YAML JSON Converter

Convert **XML ⇄ YAML ⇄ JSON** directly inside VS Code.

- Convert between formats with one command
- Pretty format or minify output
- Works from Command Palette and right-click menu
- Automatic input format detection

## Features

- Conversion commands:
  - **Convert to JSON** - Transform XML or YAML content to JSON
  - **Convert to XML** - Transform JSON or YAML content to XML
  - **Convert to YAML** - Transform JSON or XML content to YAML
- Available from:
  - Command Palette
  - Editor right-click context menu
- Automatic input format detection:
  - Content starting with `{` or `[` is parsed as JSON
  - Content starting with `<` is parsed as XML
  - All other content is parsed as YAML
- Entire document is replaced with the converted output
- Output formatting is configurable (pretty / minified)

## Usage

1. Open an XML, JSON, or YAML file
2. Right-click in the editor to open the context menu
3. Select one of the conversion commands:
   - **Convert to JSON**
   - **Convert to XML**
   - **Convert to YAML**

The file content will be replaced with the converted result.

## Settings

| Setting         | Type    | Default | Description                                           |
|-----------------|---------|---------|-------------------------------------------------------|
| `xyjson.minify` | boolean | `false` | Whether to minify output instead of pretty formatting. |

## License

MIT
