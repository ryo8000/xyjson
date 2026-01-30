import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { convert } from '../converter';

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

  suite('JSON input', () => {
    test('JSON to JSON (pretty)', () => {
      const actual = convert(jsonPretty, 'json', { minify: false });
      assert.strictEqual(actual, jsonPretty);
    });

    test('JSON to JSON (minified)', () => {
      const actual = convert(jsonPretty, 'json', { minify: true });
      assert.strictEqual(actual, jsonMinified);
    });

    test('JSON to XML (pretty)', () => {
      const actual = convert(jsonPretty, 'xml', { minify: false });
      assert.strictEqual(actual, xmlPretty);
    });

    test('JSON to XML (minified)', () => {
      const actual = convert(jsonPretty, 'xml', { minify: true });
      assert.strictEqual(actual, xmlMinified);
    });

    test('JSON to YAML (pretty)', () => {
      const actual = convert(jsonPretty, 'yaml', { minify: false });
      assert.strictEqual(actual, yamlPretty);
    });

    test('JSON to YAML (minified)', () => {
      const actual = convert(jsonPretty, 'yaml', { minify: true });
      assert.strictEqual(actual, yamlMinified);
    });
  });

  suite('JSON array input', () => {
    test('Array to JSON (pretty)', () => {
      const actual = convert(jsonArrayPretty, 'json', { minify: false });
      assert.strictEqual(actual, jsonArrayPretty);
    });

    test('Array to JSON (minified)', () => {
      const actual = convert(jsonArrayPretty, 'json', { minify: true });
      assert.strictEqual(actual, jsonArrayMinified);
    });

    test('Array to XML (pretty)', () => {
      const actual = convert(jsonArrayPretty, 'xml', { minify: false });
      assert.strictEqual(actual, xmlArrayPretty);
    });

    test('Array to XML (minified)', () => {
      const actual = convert(jsonArrayPretty, 'xml', { minify: true });
      assert.strictEqual(actual, xmlArrayMinified);
    });

    test('Array to YAML (pretty)', () => {
      const actual = convert(jsonArrayPretty, 'yaml', { minify: false });
      assert.strictEqual(actual, yamlArrayPretty);
    });

    test('Array to YAML (minified)', () => {
      const actual = convert(jsonArrayPretty, 'yaml', { minify: true });
      assert.strictEqual(actual, yamlArrayMinified);
    });
  });

  suite('XML input', () => {
    test('XML to JSON (pretty)', () => {
      const actual = convert(xmlPretty, 'json', { minify: false });
      assert.strictEqual(actual, jsonPretty);
    });

    test('XML to JSON (minified)', () => {
      const actual = convert(xmlPretty, 'json', { minify: true });
      assert.strictEqual(actual, jsonMinified);
    });

    test('XML to XML (pretty)', () => {
      const actual = convert(xmlPretty, 'xml', { minify: false });
      assert.strictEqual(actual, xmlPretty);
    });

    test('XML to XML (minified)', () => {
      const actual = convert(xmlPretty, 'xml', { minify: true });
      assert.strictEqual(actual, xmlMinified);
    });

    test('XML to YAML (pretty)', () => {
      const actual = convert(xmlPretty, 'yaml', { minify: false });
      assert.strictEqual(actual, yamlPretty);
    });

    test('XML to YAML (minified)', () => {
      const actual = convert(xmlPretty, 'yaml', { minify: true });
      assert.strictEqual(actual, yamlMinified);
    });
  });

  suite('YAML input', () => {
    test('YAML to JSON (pretty)', () => {
      const actual = convert(yamlPretty, 'json', { minify: false });
      assert.strictEqual(actual, jsonPretty);
    });

    test('YAML to JSON (minified)', () => {
      const actual = convert(yamlPretty, 'json', { minify: true });
      assert.strictEqual(actual, jsonMinified);
    });

    test('YAML to XML (pretty)', () => {
      const actual = convert(yamlPretty, 'xml', { minify: false });
      assert.strictEqual(actual, xmlPretty);
    });

    test('YAML to XML (minified)', () => {
      const actual = convert(yamlPretty, 'xml', { minify: true });
      assert.strictEqual(actual, xmlMinified);
    });

    test('YAML to YAML (pretty)', () => {
      const actual = convert(yamlPretty, 'yaml', { minify: false });
      assert.strictEqual(actual, yamlPretty);
    });

    test('YAML to YAML (minified)', () => {
      const actual = convert(yamlPretty, 'yaml', { minify: true });
      assert.strictEqual(actual, yamlMinified);
    });
  });
});
