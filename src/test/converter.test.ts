import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

import type { SupportedFormat } from '../converter';
import { convert } from '../converter';

suite('Converter Test Suite', () => {
  const readFixture = (filename: string): string =>
    fs.readFileSync(path.join(__dirname, 'fixtures', filename), 'utf-8').replace(/\r\n/g, '\n');

  const fixtures = {
    object: {
      json: {
        pretty: readFixture('json-pretty.json'),
        minified: readFixture('json-minified.json'),
      },
      xml: {
        pretty: readFixture('xml-pretty.xml'),
        minified: readFixture('xml-minified.xml')
      },
      yaml: {
        pretty: readFixture('yaml-pretty.yaml'),
        minified: readFixture('yaml-minified.yaml'),
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
    expected: string;
    description: string;
  };

  const createTestSuite = (suiteName: string, input: string, testCases: TestCase[]) => {
    suite(suiteName, () => {
      for (const { to, minify, expected, description } of testCases) {
        test(description, () => {
          const actual = convert(input, to, { minify });
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

  createTestSuite('YAML input', fixtures.object.yaml.pretty, [
    { to: 'json', minify: false, expected: fixtures.object.json.pretty, description: 'YAML to JSON (pretty)' },
    { to: 'json', minify: true, expected: fixtures.object.json.minified, description: 'YAML to JSON (minified)' },
    { to: 'xml', minify: false, expected: fixtures.object.xml.pretty, description: 'YAML to XML (pretty)' },
    { to: 'xml', minify: true, expected: fixtures.object.xml.minified, description: 'YAML to XML (minified)' },
    { to: 'yaml', minify: false, expected: fixtures.object.yaml.pretty, description: 'YAML to YAML (pretty)' },
    { to: 'yaml', minify: true, expected: fixtures.object.yaml.minified, description: 'YAML to YAML (minified)' },
  ]);
});
