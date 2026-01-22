# XYJson

A VS Code extension for converting between XML, JSON, and YAML formats.

## Features

- **Convert to JSON** - Transform XML or YAML content to JSON
- **Convert to XML** - Transform JSON or YAML content to XML
- **Convert to YAML** - Transform JSON or XML content to YAML

The extension automatically detects the input format based on the content:
- Content starting with `{` or `[` is parsed as JSON
- Content starting with `<` is parsed as XML
- All other content is parsed as YAML

## Usage

1. Open an XML, JSON, or YAML file
2. Right-click in the editor to open the context menu
3. Select one of the conversion commands:
   - **Convert to JSON**
   - **Convert to XML**
   - **Convert to YAML**

The file content will be replaced with the converted result.

## License

MIT
