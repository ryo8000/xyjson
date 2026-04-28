import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

import type { SupportedFormat } from '../../converter';
import { convert } from '../../converter';

suite('Converter Test Suite', () => {
  const readFixture = (filename: string): string =>
    fs.readFileSync(path.join(__dirname, '../fixtures', filename), 'utf-8').replace(/\r\n/g, '\n');

  const fixtures = {
    object: {
      json: {
        pretty: readFixture('json-pretty.json'),
        minified: readFixture('json-minified.json'),
        '4-space': readFixture('json-4-space.json'),
      },
      xml: {
        pretty: readFixture('xml-pretty.xml'),
        minified: readFixture('xml-minified.xml'),
        '4-space': readFixture('xml-4-space.xml'),
      },
      yaml: {
        pretty: readFixture('yaml-pretty.yaml'),
        minified: readFixture('yaml-minified.yaml'),
        '4-space': readFixture('yaml-4-space.yaml'),
      },
    },
    array: {
      json: {
        pretty: readFixture('json-array-pretty.json'),
        minified: readFixture('json-array-minified.json'),
      },
      xml: {
        pretty: readFixture('xml-array-pretty.xml'),
        minified: readFixture('xml-array-minified.xml'),
      },
      yaml: {
        pretty: readFixture('yaml-array-pretty.yaml'),
        minified: readFixture('yaml-array-minified.yaml'),
      },
    },
  };

  type TestCase = {
    to: SupportedFormat;
    minify: boolean;
    indentSize?: number;
    attributeNamePrefix?: string;
    expected: string;
    description: string;
  };

  const createTestSuite = (suiteName: string, input: string, testCases: TestCase[]) => {
    suite(suiteName, () => {
      for (const { to, minify, indentSize = 2, attributeNamePrefix = '@_', expected, description } of testCases) {
        test(description, () => {
          const actual = convert(input, to, { minify, indentSize, attributeNamePrefix });
          assert.strictEqual(actual, expected);
        });
      }
    });
  };

  createTestSuite('JSON input', fixtures.object.json.pretty, [
    { to: 'json', minify: false, expected: fixtures.object.json.pretty, description: 'JSON to JSON (pretty)' },
    { to: 'json', minify: true, expected: fixtures.object.json.minified, description: 'JSON to JSON (minified)' },
    { to: 'xml', minify: false, expected: fixtures.object.xml.pretty, description: 'JSON to XML (pretty)' },
    { to: 'xml', minify: true, expected: fixtures.object.xml.minified, description: 'JSON to XML (minified)' },
    { to: 'yaml', minify: false, expected: fixtures.object.yaml.pretty, description: 'JSON to YAML (pretty)' },
    { to: 'yaml', minify: true, expected: fixtures.object.yaml.minified, description: 'JSON to YAML (minified)' },
  ]);

  createTestSuite('JSON minified input', fixtures.object.json.minified, [
    { to: 'json', minify: false, expected: fixtures.object.json.pretty, description: 'JSON minified to JSON (pretty)' },
    { to: 'json', minify: true, expected: fixtures.object.json.minified, description: 'JSON minified to JSON (minified)' },
    { to: 'xml', minify: false, expected: fixtures.object.xml.pretty, description: 'JSON minified to XML (pretty)' },
    { to: 'xml', minify: true, expected: fixtures.object.xml.minified, description: 'JSON minified to XML (minified)' },
    { to: 'yaml', minify: false, expected: fixtures.object.yaml.pretty, description: 'JSON minified to YAML (pretty)' },
    { to: 'yaml', minify: true, expected: fixtures.object.yaml.minified, description: 'JSON minified to YAML (minified)' },
  ]);

  createTestSuite('JSON array input', fixtures.array.json.pretty, [
    { to: 'json', minify: false, expected: fixtures.array.json.pretty, description: 'Array to JSON (pretty)' },
    { to: 'json', minify: true, expected: fixtures.array.json.minified, description: 'Array to JSON (minified)' },
    { to: 'xml', minify: false, expected: fixtures.array.xml.pretty, description: 'Array to XML (pretty)' },
    { to: 'xml', minify: true, expected: fixtures.array.xml.minified, description: 'Array to XML (minified)' },
    { to: 'yaml', minify: false, expected: fixtures.array.yaml.pretty, description: 'Array to YAML (pretty)' },
    { to: 'yaml', minify: true, expected: fixtures.array.yaml.minified, description: 'Array to YAML (minified)' },
  ]);

  createTestSuite('XML input', fixtures.object.xml.pretty, [
    { to: 'json', minify: false, expected: fixtures.object.json.pretty, description: 'XML to JSON (pretty)' },
    { to: 'json', minify: true, expected: fixtures.object.json.minified, description: 'XML to JSON (minified)' },
    { to: 'xml', minify: false, expected: fixtures.object.xml.pretty, description: 'XML to XML (pretty)' },
    { to: 'xml', minify: true, expected: fixtures.object.xml.minified, description: 'XML to XML (minified)' },
    { to: 'yaml', minify: false, expected: fixtures.object.yaml.pretty, description: 'XML to YAML (pretty)' },
    { to: 'yaml', minify: true, expected: fixtures.object.yaml.minified, description: 'XML to YAML (minified)' },
  ]);

  createTestSuite('XML minified input', fixtures.object.xml.minified, [
    { to: 'json', minify: false, expected: fixtures.object.json.pretty, description: 'XML minified to JSON (pretty)' },
    { to: 'json', minify: true, expected: fixtures.object.json.minified, description: 'XML minified to JSON (minified)' },
    { to: 'xml', minify: false, expected: fixtures.object.xml.pretty, description: 'XML minified to XML (pretty)' },
    { to: 'xml', minify: true, expected: fixtures.object.xml.minified, description: 'XML minified to XML (minified)' },
    { to: 'yaml', minify: false, expected: fixtures.object.yaml.pretty, description: 'XML minified to YAML (pretty)' },
    { to: 'yaml', minify: true, expected: fixtures.object.yaml.minified, description: 'XML minified to YAML (minified)' },
  ]);

  createTestSuite('YAML input', fixtures.object.yaml.pretty, [
    { to: 'json', minify: false, expected: fixtures.object.json.pretty, description: 'YAML to JSON (pretty)' },
    { to: 'json', minify: true, expected: fixtures.object.json.minified, description: 'YAML to JSON (minified)' },
    { to: 'xml', minify: false, expected: fixtures.object.xml.pretty, description: 'YAML to XML (pretty)' },
    { to: 'xml', minify: true, expected: fixtures.object.xml.minified, description: 'YAML to XML (minified)' },
    { to: 'yaml', minify: false, expected: fixtures.object.yaml.pretty, description: 'YAML to YAML (pretty)' },
    { to: 'yaml', minify: true, expected: fixtures.object.yaml.minified, description: 'YAML to YAML (minified)' },
  ]);

  createTestSuite('YAML minified input', fixtures.object.yaml.minified, [
    { to: 'json', minify: false, expected: fixtures.object.json.pretty, description: 'YAML minified to JSON (pretty)' },
    { to: 'json', minify: true, expected: fixtures.object.json.minified, description: 'YAML minified to JSON (minified)' },
    { to: 'xml', minify: false, expected: fixtures.object.xml.pretty, description: 'YAML minified to XML (pretty)' },
    { to: 'xml', minify: true, expected: fixtures.object.xml.minified, description: 'YAML minified to XML (minified)' },
    { to: 'yaml', minify: false, expected: fixtures.object.yaml.pretty, description: 'YAML minified to YAML (pretty)' },
    { to: 'yaml', minify: true, expected: fixtures.object.yaml.minified, description: 'YAML minified to YAML (minified)' },
  ]);

  createTestSuite('JSON input with indentSize 4', fixtures.object.json.pretty, [
    { to: 'json', minify: false, indentSize: 4, expected: fixtures.object.json['4-space'], description: 'JSON to JSON (4-space)' },
    { to: 'json', minify: true, indentSize: 4, expected: fixtures.object.json.minified, description: 'JSON to JSON (minified)' },
    { to: 'xml', minify: false, indentSize: 4, expected: fixtures.object.xml['4-space'], description: 'JSON to XML (4-space)' },
    { to: 'xml', minify: true, indentSize: 4, expected: fixtures.object.xml.minified, description: 'JSON to XML (minified)' },
    { to: 'yaml', minify: false, indentSize: 4, expected: fixtures.object.yaml['4-space'], description: 'JSON to YAML (4-space)' },
    { to: 'yaml', minify: true, indentSize: 4, expected: fixtures.object.yaml.minified, description: 'JSON to YAML (minified)' },
  ]);

  createTestSuite('XML input with attributeNamePrefix "$"', fixtures.object.xml.pretty, [
    { to: 'json', minify: false, attributeNamePrefix: '$', expected: '{\n  "profiles": {\n    "name": "test",\n    "value": 123,\n    "$id": "1"\n  }\n}\n', description: 'XML to JSON (pretty)' },
    { to: 'json', minify: true, attributeNamePrefix: '$', expected: '{"profiles":{"name":"test","value":123,"$id":"1"}}', description: 'XML to JSON (minified)' },
    { to: 'xml', minify: false, attributeNamePrefix: '$', expected: fixtures.object.xml.pretty, description: 'XML to XML (pretty)' },
    { to: 'xml', minify: true, attributeNamePrefix: '$', expected: fixtures.object.xml.minified, description: 'XML to XML (minified)' },
    { to: 'yaml', minify: false, attributeNamePrefix: '$', expected: 'profiles:\n  name: test\n  value: 123\n  $id: \'1\'\n', description: 'XML to YAML (pretty)' },
    { to: 'yaml', minify: true, attributeNamePrefix: '$', expected: '{profiles: {name: test, value: 123, $id: \'1\'}}\n', description: 'XML to YAML (minified)' },
  ]);

  createTestSuite('XML input with attributeNamePrefix ""', fixtures.object.xml.pretty, [
    { to: 'json', minify: false, attributeNamePrefix: '', expected: '{\n  "profiles": {\n    "name": "test",\n    "value": 123,\n    "id": "1"\n  }\n}\n', description: 'XML to JSON (pretty)' },
    { to: 'json', minify: true, attributeNamePrefix: '', expected: '{"profiles":{"name":"test","value":123,"id":"1"}}', description: 'XML to JSON (minified)' },
    { to: 'xml', minify: false, attributeNamePrefix: '', expected: '<profiles name="test" value="123" id="1"></profiles>\n', description: 'XML to XML (pretty)' },
    { to: 'xml', minify: true, attributeNamePrefix: '', expected: '<profiles name="test" value="123" id="1"></profiles>', description: 'XML to XML (minified)' },
    { to: 'yaml', minify: false, attributeNamePrefix: '', expected: 'profiles:\n  name: test\n  value: 123\n  id: \'1\'\n', description: 'XML to YAML (pretty)' },
    { to: 'yaml', minify: true, attributeNamePrefix: '', expected: '{profiles: {name: test, value: 123, id: \'1\'}}\n', description: 'XML to YAML (minified)' },
  ]);
});
