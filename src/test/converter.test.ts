import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { convert, SupportedFormat } from '../converter';

suite('Converter Test Suite', () => {
  const readFixture = (filename: string): string =>
    fs.readFileSync(path.join(__dirname, 'fixtures', filename), 'utf-8');

  const jsonMinified = readFixture('json-minified.json');
  const jsonPretty = readFixture('json-pretty.json');
  const xmlMinified = readFixture('xml-minified.xml');
  const xmlPretty = readFixture('xml-pretty.xml');
  const yamlMinified = readFixture('yaml-minified.yaml');
  const yamlPretty = readFixture('yaml-pretty.yaml');
  const jsonArrayMinified = readFixture('json-array-minified.json');
  const jsonArrayPretty = readFixture('json-array-pretty.json');
  const xmlArrayMinified = readFixture('xml-array-minified.xml');
  const xmlArrayPretty = readFixture('xml-array-pretty.xml');
  const yamlArrayPretty = readFixture('yaml-array-pretty.yaml');
  const yamlArrayMinified = readFixture('yaml-array-minified.yaml');

  type TestCase = {
    to: SupportedFormat;
    minify: boolean;
    expected: string;
    description: string;
  };

  suite('JSON input', () => {
    const testCases: TestCase[] = [
      { to: 'json', minify: false, expected: jsonPretty, description: 'JSON to JSON (pretty)' },
      { to: 'json', minify: true, expected: jsonMinified, description: 'JSON to JSON (minified)' },
      { to: 'xml', minify: false, expected: xmlPretty, description: 'JSON to XML (pretty)' },
      { to: 'xml', minify: true, expected: xmlMinified, description: 'JSON to XML (minified)' },
      { to: 'yaml', minify: false, expected: yamlPretty, description: 'JSON to YAML (pretty)' },
      { to: 'yaml', minify: true, expected: yamlMinified, description: 'JSON to YAML (minified)' },
    ];

    for (const { to, minify, expected, description } of testCases) {
      test(description, () => {
        const actual = convert(jsonPretty, to, { minify });
        assert.strictEqual(actual, expected);
      });
    }
  });

  suite('JSON array input', () => {
    const testCases: TestCase[] = [
      { to: 'json', minify: false, expected: jsonArrayPretty, description: 'Array to JSON (pretty)' },
      { to: 'json', minify: true, expected: jsonArrayMinified, description: 'Array to JSON (minified)' },
      { to: 'xml', minify: false, expected: xmlArrayPretty, description: 'Array to XML (pretty)' },
      { to: 'xml', minify: true, expected: xmlArrayMinified, description: 'Array to XML (minified)' },
      { to: 'yaml', minify: false, expected: yamlArrayPretty, description: 'Array to YAML (pretty)' },
      { to: 'yaml', minify: true, expected: yamlArrayMinified, description: 'Array to YAML (minified)' },
    ];

    for (const { to, minify, expected, description } of testCases) {
      test(description, () => {
        const actual = convert(jsonArrayPretty, to, { minify });
        assert.strictEqual(actual, expected);
      });
    }
  });

  suite('XML input', () => {
    const testCases: TestCase[] = [
      { to: 'json', minify: false, expected: jsonPretty, description: 'XML to JSON (pretty)' },
      { to: 'json', minify: true, expected: jsonMinified, description: 'XML to JSON (minified)' },
      { to: 'xml', minify: false, expected: xmlPretty, description: 'XML to XML (pretty)' },
      { to: 'xml', minify: true, expected: xmlMinified, description: 'XML to XML (minified)' },
      { to: 'yaml', minify: false, expected: yamlPretty, description: 'XML to YAML (pretty)' },
      { to: 'yaml', minify: true, expected: yamlMinified, description: 'XML to YAML (minified)' },
    ];

    for (const { to, minify, expected, description } of testCases) {
      test(description, () => {
        const actual = convert(xmlPretty, to, { minify });
        assert.strictEqual(actual, expected);
      });
    }
  });

  suite('YAML input', () => {
    const testCases: TestCase[] = [
      { to: 'json', minify: false, expected: jsonPretty, description: 'YAML to JSON (pretty)' },
      { to: 'json', minify: true, expected: jsonMinified, description: 'YAML to JSON (minified)' },
      { to: 'xml', minify: false, expected: xmlPretty, description: 'YAML to XML (pretty)' },
      { to: 'xml', minify: true, expected: xmlMinified, description: 'YAML to XML (minified)' },
      { to: 'yaml', minify: false, expected: yamlPretty, description: 'YAML to YAML (pretty)' },
      { to: 'yaml', minify: true, expected: yamlMinified, description: 'YAML to YAML (minified)' },
    ];

    for (const { to, minify, expected, description } of testCases) {
      test(description, () => {
        const actual = convert(yamlPretty, to, { minify });
        assert.strictEqual(actual, expected);
      });
    }
  });
});
