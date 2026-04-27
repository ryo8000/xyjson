import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  let quickPickResponse: { label: string } | undefined = { label: 'Pretty' };
  const originalShowQuickPick = (vscode.window as any).showQuickPick;

  suiteSetup(() => {
    (vscode.window as any).showQuickPick = async () => quickPickResponse;
  });

  suiteTeardown(() => {
    (vscode.window as any).showQuickPick = originalShowQuickPick;
  });

  const commandLabel = (command: string): string => command.replace(/^xyjson\./, '');

  const formatOfFixture = (fixture: string): string => path.extname(fixture).slice(1).toUpperCase();

  const readFixture = (filename: string): string =>
    fs.readFileSync(path.join(__dirname, '../fixtures', filename), 'utf-8').replace(/\r\n/g, '\n');

  const openEditorWithContent = async (content: string): Promise<vscode.TextEditor> => {
    const doc = await vscode.workspace.openTextDocument({ content, language: 'plaintext' });
    return vscode.window.showTextDocument(doc);
  };

  const getEditorText = (editor: vscode.TextEditor): string => {
    return editor.document.getText().replace(/\r\n/g, '\n');
  };

  const setAttributeNamePrefix = async (value: string): Promise<void> => {
    await vscode.workspace
      .getConfiguration('xyjson')
      .update('xmlAttributeNamePrefix', value, vscode.ConfigurationTarget.Global);
  };

  teardown(async () => {
    quickPickResponse = { label: 'Pretty' };
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    await setAttributeNamePrefix('@_');
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

  suite('Format Commands', () => {
    const cases = [
      { command: 'xyjson.formatJson', input: 'json-minified.json', expectedFixture: 'json-pretty.json' },
      { command: 'xyjson.formatXml',  input: 'xml-minified.xml',   expectedFixture: 'xml-pretty.xml'  },
      { command: 'xyjson.formatYaml', input: 'yaml-minified.yaml', expectedFixture: 'yaml-pretty.yaml' },
    ] as const;

    for (const { command, input, expectedFixture } of cases) {
      test(`${commandLabel(command)} reformats minified input`, async () => {
        const editor = await openEditorWithContent(readFixture(input));
        await vscode.commands.executeCommand(command);
        assert.strictEqual(getEditorText(editor), readFixture(expectedFixture));
      });
    }
  });

  suite('Output Format Selection', () => {
    const cases = [
      { command: 'xyjson.toJson', expectedFixture: 'json-minified.json' },
      { command: 'xyjson.toXml', expectedFixture: 'xml-minified.xml' },
      { command: 'xyjson.toYaml', expectedFixture: 'yaml-minified.yaml' },
    ] as const;

    for (const c of cases) {
      test(`${commandLabel(c.command)} produces minified output when "Minified" is selected`, async () => {
        quickPickResponse = { label: 'Minified' };
        const editor = await openEditorWithContent(readFixture('json-pretty.json'));
        await vscode.commands.executeCommand(c.command);
        assert.strictEqual(getEditorText(editor), readFixture(c.expectedFixture));
      });
    }

    test('cancelling Quick Pick leaves document unchanged', async () => {
      quickPickResponse = undefined;
      const content = readFixture('json-pretty.json');
      const editor = await openEditorWithContent(content);
      await vscode.commands.executeCommand('xyjson.toYaml');
      assert.strictEqual(getEditorText(editor), content);
    });
  });

  suite('AttributeNamePrefix Configuration', () => {
    const cases = [
      { prefix: '$', expectedKey: '$id' },
      { prefix: '', expectedKey: 'id' },
      { prefix: 'a_', expectedKey: 'a_id' },
    ] as const;

    for (const { prefix, expectedKey } of cases) {
      test(`toJson maps attribute key with prefix "${prefix}"`, async () => {
        await setAttributeNamePrefix(prefix);
        const editor = await openEditorWithContent(readFixture('xml-pretty.xml'));
        await vscode.commands.executeCommand('xyjson.toJson');
        const parsed = JSON.parse(getEditorText(editor));
        assert.strictEqual(parsed.profiles[expectedKey], '1');
      });
    }

    test('toXml round-trip preserves attribute with custom prefix "$"', async () => {
      await setAttributeNamePrefix('$');
      const editor = await openEditorWithContent(readFixture('xml-pretty.xml'));
      await vscode.commands.executeCommand('xyjson.toXml');
      const first = getEditorText(editor);
      await vscode.commands.executeCommand('xyjson.toXml');
      assert.strictEqual(getEditorText(editor), first);
    });
  });

  suite('Selection-only Conversion', () => {
    test('converts only the selected text, leaving the rest unchanged', async () => {
      const jsonSnippet = readFixture('json-pretty.json');
      const prefix = 'prefix text\n';
      const suffix = '\nsuffix text';
      const editor = await openEditorWithContent(prefix + jsonSnippet + suffix);

      const startPos = editor.document.positionAt(prefix.length);
      const endPos = editor.document.positionAt(prefix.length + jsonSnippet.length);
      editor.selection = new vscode.Selection(startPos, endPos);

      await vscode.commands.executeCommand('xyjson.toYaml');

      const text = getEditorText(editor);
      assert.ok(text.startsWith(prefix), 'prefix should be unchanged');
      assert.ok(text.endsWith(suffix), 'suffix should be unchanged');
      const converted = text.slice(prefix.length, text.length - suffix.length);
      assert.strictEqual(converted, readFixture('yaml-pretty.yaml'));
    });

    test('converts entire document when selection is empty', async () => {
      const editor = await openEditorWithContent(readFixture('json-pretty.json'));
      // selection is empty by default
      await vscode.commands.executeCommand('xyjson.toYaml');
      assert.strictEqual(getEditorText(editor), readFixture('yaml-pretty.yaml'));
    });
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
