import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  const commandLabel = (command: string): string => command.replace(/^xyjson\./, '');

  const formatOfFixture = (fixture: string): string => {
    return path.extname(fixture).slice(1).toUpperCase();
  };

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
    const cases = [
      { command: 'xyjson.toJson', expectedFixture: 'json-pretty.json' },
      { command: 'xyjson.toXml', expectedFixture: 'xml-pretty.xml' },
      { command: 'xyjson.toYaml', expectedFixture: 'yaml-pretty.yaml' },
    ] as const;

    const inputFixtures = [
      'json-pretty.json',
      'xml-pretty.xml',
      'yaml-pretty.yaml',
    ] as const;

    for (const c of cases) {
      suite(`${commandLabel(c.command)} command`, () => {
        for (const inputFixture of inputFixtures) {
          test(`converts ${formatOfFixture(inputFixture)} to ${formatOfFixture(c.expectedFixture)}`, async () => {
            const editor = await openEditorWithContent(readFixture(inputFixture));
            await vscode.commands.executeCommand(c.command);
            assert.strictEqual(getEditorText(editor), readFixture(c.expectedFixture));
          });
        }
      });
    }
  });

  suite('Minify Configuration', () => {
    const cases = [
      { command: 'xyjson.toJson', expectedFixture: 'json-minified.json' },
      { command: 'xyjson.toXml', expectedFixture: 'xml-minified.xml' },
      { command: 'xyjson.toYaml', expectedFixture: 'yaml-minified.yaml' },
    ] as const;

    for (const c of cases) {
      test(`${commandLabel(c.command)} produces minified output when xyjson.minify is true`, async () => {
        await setMinify(true);
        const editor = await openEditorWithContent(readFixture('json-pretty.json'));
        await vscode.commands.executeCommand(c.command);
        assert.strictEqual(getEditorText(editor), readFixture(c.expectedFixture));
      });
    }
  });

  suite('Error Cases', () => {
    const commands = ['xyjson.toJson', 'xyjson.toXml', 'xyjson.toYaml'] as const;

    for (const command of commands) {
      suite(`${command} command`, () => {
        test('no active editor — command resolves without throwing', async () => {
          await vscode.commands.executeCommand('workbench.action.closeAllEditors');
          await assert.doesNotReject(Promise.resolve(vscode.commands.executeCommand(command)));
        });

        test('empty document — document unchanged', async () => {
          const editor = await openEditorWithContent('');
          await vscode.commands.executeCommand(command);
          assert.strictEqual(getEditorText(editor), '');
        });

        test('whitespace-only document — document unchanged', async () => {
          const content = '   \n  \n  ';
          const editor = await openEditorWithContent(content);
          await vscode.commands.executeCommand(command);
          assert.strictEqual(getEditorText(editor), content);
        });

        test('invalid content — document unchanged', async () => {
          const invalid = 'not valid json or xml or yaml: {{{';
          const editor = await openEditorWithContent(invalid);
          await vscode.commands.executeCommand(command);
          assert.strictEqual(getEditorText(editor), invalid);
        });
      });
    }
  });
});
