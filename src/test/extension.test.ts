import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  const readFixture = (filename: string): string =>
    fs.readFileSync(path.join(__dirname, 'fixtures', filename), 'utf-8').replace(/\r\n/g, '\n');

  const openEditorWithContent = async (content: string): Promise<vscode.TextEditor> => {
    const doc = await vscode.workspace.openTextDocument({ content, language: 'plaintext' });
    return vscode.window.showTextDocument(doc);
  };

  const getEditorText = (editor: vscode.TextEditor): string => {
    return editor.document.getText().replace(/\r\n/g, '\n');
  };

  const setMinify = async (value: boolean): Promise<void> => {
    await vscode.workspace
      .getConfiguration('xyjson')
      .update('minify', value, vscode.ConfigurationTarget.Global);
  };

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    await setMinify(false);
  });

  suite('Successful Conversion', () => {
    suite('toJson command', () => {
      test('converts JSON to JSON', async () => {
        const editor = await openEditorWithContent(readFixture('json-pretty.json'));
        await vscode.commands.executeCommand('xyjson.toJson');
        assert.strictEqual(getEditorText(editor), readFixture('json-pretty.json'));
      });

      test('converts XML to JSON', async () => {
        const editor = await openEditorWithContent(readFixture('xml-pretty.xml'));
        await vscode.commands.executeCommand('xyjson.toJson');
        assert.strictEqual(getEditorText(editor), readFixture('json-pretty.json'));
      });

      test('converts YAML to JSON', async () => {
        const editor = await openEditorWithContent(readFixture('yaml-pretty.yaml'));
        await vscode.commands.executeCommand('xyjson.toJson');
        assert.strictEqual(getEditorText(editor), readFixture('json-pretty.json'));
      });
    });

    suite('toXml command', () => {
      test('converts JSON to XML', async () => {
        const editor = await openEditorWithContent(readFixture('json-pretty.json'));
        await vscode.commands.executeCommand('xyjson.toXml');
        assert.strictEqual(getEditorText(editor), readFixture('xml-pretty.xml'));
      });

      test('converts XML to XML', async () => {
        const editor = await openEditorWithContent(readFixture('xml-pretty.xml'));
        await vscode.commands.executeCommand('xyjson.toXml');
        assert.strictEqual(getEditorText(editor), readFixture('xml-pretty.xml'));
      });

      test('converts YAML to XML', async () => {
        const editor = await openEditorWithContent(readFixture('yaml-pretty.yaml'));
        await vscode.commands.executeCommand('xyjson.toXml');
        assert.strictEqual(getEditorText(editor), readFixture('xml-pretty.xml'));
      });
    });

    suite('toYaml command', () => {
      test('converts JSON to YAML', async () => {
        const editor = await openEditorWithContent(readFixture('json-pretty.json'));
        await vscode.commands.executeCommand('xyjson.toYaml');
        assert.strictEqual(getEditorText(editor), readFixture('yaml-pretty.yaml'));
      });

      test('converts XML to YAML', async () => {
        const editor = await openEditorWithContent(readFixture('xml-pretty.xml'));
        await vscode.commands.executeCommand('xyjson.toYaml');
        assert.strictEqual(getEditorText(editor), readFixture('yaml-pretty.yaml'));
      });

      test('converts YAML to YAML', async () => {
        const editor = await openEditorWithContent(readFixture('yaml-pretty.yaml'));
        await vscode.commands.executeCommand('xyjson.toYaml');
        assert.strictEqual(getEditorText(editor), readFixture('yaml-pretty.yaml'));
      });
    });
  });

  suite('Minify Configuration', () => {
    test('toJson produces minified output when xyjson.minify is true', async () => {
      await setMinify(true);
      const editor = await openEditorWithContent(readFixture('json-pretty.json'));
      await vscode.commands.executeCommand('xyjson.toJson');
      assert.strictEqual(getEditorText(editor), readFixture('json-minified.json'));
    });

    test('toXml produces minified output when xyjson.minify is true', async () => {
      await setMinify(true);
      const editor = await openEditorWithContent(readFixture('json-pretty.json'));
      await vscode.commands.executeCommand('xyjson.toXml');
      assert.strictEqual(getEditorText(editor), readFixture('xml-minified.xml'));
    });

    test('toYaml produces minified output when xyjson.minify is true', async () => {
      await setMinify(true);
      const editor = await openEditorWithContent(readFixture('json-pretty.json'));
      await vscode.commands.executeCommand('xyjson.toYaml');
      assert.strictEqual(getEditorText(editor), readFixture('yaml-minified.yaml'));
    });
  });

  suite('Error Cases', () => {
    test('no active editor — command resolves without throwing', async () => {
      await vscode.commands.executeCommand('workbench.action.closeAllEditors');
      await assert.doesNotReject(Promise.resolve(vscode.commands.executeCommand('xyjson.toJson')));
    });

    test('empty document — document unchanged', async () => {
      const editor = await openEditorWithContent('');
      await vscode.commands.executeCommand('xyjson.toJson');
      assert.strictEqual(getEditorText(editor), '');
    });

    test('whitespace-only document — document unchanged', async () => {
      const editor = await openEditorWithContent('   \n  \n  ');
      await vscode.commands.executeCommand('xyjson.toJson');
      assert.strictEqual(getEditorText(editor), '   \n  \n  ');
    });

    test('invalid content — document unchanged', async () => {
      const invalid = 'not valid json or xml or yaml: {{{';
      const editor = await openEditorWithContent(invalid);
      await vscode.commands.executeCommand('xyjson.toJson');
      assert.strictEqual(getEditorText(editor), invalid);
    });
  });
});
