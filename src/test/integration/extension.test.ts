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

  const getActiveEditorText = (): string => getEditorText(vscode.window.activeTextEditor!);

  const setOutputStyle = async (value: string): Promise<void> => {
    await vscode.workspace
      .getConfiguration('xyjson')
      .update('outputStyle', value, vscode.ConfigurationTarget.Global);
  };

  const setConvertOutput = async (value: string): Promise<void> => {
    await vscode.workspace
      .getConfiguration('xyjson')
      .update('convertOutput', value, vscode.ConfigurationTarget.Global);
  };

  const setIndentSize = async (value: number): Promise<void> => {
    await vscode.workspace
      .getConfiguration('xyjson')
      .update('indentSize', value, vscode.ConfigurationTarget.Global);
  };

  const setAttributeNamePrefix = async (value: string): Promise<void> => {
    await vscode.workspace
      .getConfiguration('xyjson')
      .update('xmlAttributeNamePrefix', value, vscode.ConfigurationTarget.Global);
  };

  teardown(async () => {
    quickPickResponse = { label: 'Pretty' };
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    await setOutputStyle('ask');
    await setConvertOutput('newTab');
    await setIndentSize(2);
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
            await openEditorWithContent(readFixture(inputFixture));
            await vscode.commands.executeCommand(c.command);
            assert.strictEqual(getActiveEditorText(), readFixture(c.expectedFixture));
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
        await openEditorWithContent(readFixture('json-pretty.json'));
        await vscode.commands.executeCommand(c.command);
        assert.strictEqual(getActiveEditorText(), readFixture(c.expectedFixture));
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

  suite('OutputStyle Configuration', () => {
    test('skips Quick Pick and produces pretty output when outputStyle is "pretty"', async () => {
      await setOutputStyle('pretty');
      quickPickResponse = undefined;
      await openEditorWithContent(readFixture('json-pretty.json'));
      await vscode.commands.executeCommand('xyjson.toYaml');
      assert.strictEqual(getActiveEditorText(), readFixture('yaml-pretty.yaml'));
    });

    test('skips Quick Pick and produces minified output when outputStyle is "minified"', async () => {
      await setOutputStyle('minified');
      quickPickResponse = undefined;
      await openEditorWithContent(readFixture('json-pretty.json'));
      await vscode.commands.executeCommand('xyjson.toYaml');
      assert.strictEqual(getActiveEditorText(), readFixture('yaml-minified.yaml'));
    });

    test('shows Quick Pick when outputStyle is "ask"', async () => {
      await setOutputStyle('ask');
      quickPickResponse = { label: 'Minified' };
      await openEditorWithContent(readFixture('json-pretty.json'));
      await vscode.commands.executeCommand('xyjson.toYaml');
      assert.strictEqual(getActiveEditorText(), readFixture('yaml-minified.yaml'));
    });
  });

  suite('ConvertOutput Configuration', () => {
    test('opens result in new tab, leaving original unchanged when convertOutput is "newTab"', async () => {
      await setConvertOutput('newTab');
      const editor = await openEditorWithContent(readFixture('json-pretty.json'));
      await vscode.commands.executeCommand('xyjson.toYaml');
      assert.strictEqual(getActiveEditorText(), readFixture('yaml-pretty.yaml'));
      assert.strictEqual(getEditorText(editor), readFixture('json-pretty.json'));
      assert.strictEqual(vscode.window.activeTextEditor?.viewColumn, editor.viewColumn, 'Output should be in the same column');
    });

    test('opens result beside current editor, leaving original unchanged when convertOutput is "beside"', async () => {
      await setConvertOutput('beside');
      const editor = await openEditorWithContent(readFixture('json-pretty.json'));
      await vscode.commands.executeCommand('xyjson.toYaml');
      assert.strictEqual(getActiveEditorText(), readFixture('yaml-pretty.yaml'));
      assert.strictEqual(getEditorText(editor), readFixture('json-pretty.json'));
      assert.ok(vscode.window.activeTextEditor, 'Expected an active editor after conversion');
      assert.notStrictEqual(vscode.window.activeTextEditor.viewColumn, editor.viewColumn, 'Output should be in a different column');
    });
  });

  suite('IndentSize Configuration', () => {
    const cases = [
      { command: 'xyjson.toJson', expectedFixture: 'json-4-space.json' },
      { command: 'xyjson.toYaml', expectedFixture: 'yaml-4-space.yaml' },
      { command: 'xyjson.toXml', expectedFixture: 'xml-4-space.xml' },
    ] as const;

    for (const { command, expectedFixture } of cases) {
      test(`${commandLabel(command)} produces 4-space indented output when xyjson.indentSize is 4`, async () => {
        await setIndentSize(4);
        await openEditorWithContent(readFixture('json-pretty.json'));
        await vscode.commands.executeCommand(command);
        assert.strictEqual(getActiveEditorText(), readFixture(expectedFixture));
      });
    }
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
        await openEditorWithContent(readFixture('xml-pretty.xml'));
        await vscode.commands.executeCommand('xyjson.toJson');
        const parsed = JSON.parse(getActiveEditorText());
        assert.strictEqual(parsed.profiles[expectedKey], '1');
      });
    }

    test('toXml round-trip preserves attribute with custom prefix "$"', async () => {
      await setAttributeNamePrefix('$');
      await openEditorWithContent(readFixture('xml-pretty.xml'));
      await vscode.commands.executeCommand('xyjson.toXml');
      const first = getActiveEditorText();
      await vscode.commands.executeCommand('xyjson.toXml');
      assert.strictEqual(getActiveEditorText(), first);
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

      assert.strictEqual(getEditorText(editor), prefix + jsonSnippet + suffix);
      assert.strictEqual(getActiveEditorText(), readFixture('yaml-pretty.yaml'));
    });

    test('converts entire document when selection is empty', async () => {
      await openEditorWithContent(readFixture('json-pretty.json'));
      // selection is empty by default
      await vscode.commands.executeCommand('xyjson.toYaml');
      assert.strictEqual(getActiveEditorText(), readFixture('yaml-pretty.yaml'));
    });
  });

  suite('Format Command Guard Behavior', () => {
    test('format command leaves document unchanged when active editor changes during Quick Pick', async () => {
      const content = readFixture('json-minified.json');
      const editor = await openEditorWithContent(content);
      const suiteMock = (vscode.window as any).showQuickPick;

      (vscode.window as any).showQuickPick = async () => {
        await openEditorWithContent('other content');
        return { label: 'Pretty' };
      };

      try {
        await vscode.commands.executeCommand('xyjson.formatJson');
        assert.strictEqual(getEditorText(editor), content);
      } finally {
        (vscode.window as any).showQuickPick = suiteMock;
      }
    });

    test('format command leaves document unchanged when document is edited during Quick Pick', async () => {
      const content = readFixture('json-minified.json');
      const editor = await openEditorWithContent(content);
      const suiteMock = (vscode.window as any).showQuickPick;
      let editedContent: string;

      (vscode.window as any).showQuickPick = async () => {
        const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
        await editor.edit((b) => b.insert(lastLine.range.end, ' '));
        editedContent = getEditorText(editor);
        return { label: 'Pretty' };
      };

      try {
        await vscode.commands.executeCommand('xyjson.formatJson');
        assert.strictEqual(getEditorText(editor), editedContent!);
      } finally {
        (vscode.window as any).showQuickPick = suiteMock;
      }
    });

    test('format command leaves document unchanged when selection changes during Quick Pick', async () => {
      const content = readFixture('json-minified.json');
      const editor = await openEditorWithContent(content);
      const suiteMock = (vscode.window as any).showQuickPick;

      const startPos = editor.document.positionAt(0);
      const endPos = editor.document.positionAt(content.length);
      editor.selection = new vscode.Selection(startPos, endPos);

      (vscode.window as any).showQuickPick = async () => {
        editor.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));
        return { label: 'Pretty' };
      };

      try {
        await vscode.commands.executeCommand('xyjson.formatJson');
        assert.strictEqual(getEditorText(editor), content);
      } finally {
        (vscode.window as any).showQuickPick = suiteMock;
      }
    });

    test('format command applies to whole document when cursor moves during Quick Pick (no initial selection)', async () => {
      const content = readFixture('json-minified.json');
      const editor = await openEditorWithContent(content);
      const suiteMock = (vscode.window as any).showQuickPick;

      editor.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));

      (vscode.window as any).showQuickPick = async () => {
        const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
        editor.selection = new vscode.Selection(lastLine.range.end, lastLine.range.end);
        return { label: 'Pretty' };
      };

      try {
        await vscode.commands.executeCommand('xyjson.formatJson');
        assert.strictEqual(getEditorText(editor), readFixture('json-pretty.json'));
      } finally {
        (vscode.window as any).showQuickPick = suiteMock;
      }
    });
  });

  suite('Clipboard Paste Commands', () => {
    const cases = [
      { command: 'xyjson.clipboardToJson', expectedFixture: 'json-pretty.json' },
      { command: 'xyjson.clipboardToXml', expectedFixture: 'xml-pretty.xml' },
      { command: 'xyjson.clipboardToYaml', expectedFixture: 'yaml-pretty.yaml' },
    ] as const;

    const inputFixtures = ['json-pretty.json', 'xml-pretty.xml', 'yaml-pretty.yaml'] as const;

    for (const c of cases) {
      suite(`${commandLabel(c.command)} command`, () => {
        for (const inputFixture of inputFixtures) {
          test(`pastes ${formatOfFixture(inputFixture)} from clipboard as ${formatOfFixture(c.expectedFixture)}`, async () => {
            await vscode.env.clipboard.writeText(readFixture(inputFixture));
            await vscode.commands.executeCommand(c.command);
            assert.strictEqual(getActiveEditorText(), readFixture(c.expectedFixture));
          });
        }

        test('minified output when "Minified" is selected', async () => {
          quickPickResponse = { label: 'Minified' };
          await vscode.env.clipboard.writeText(readFixture('json-pretty.json'));
          const expectedFixture = c.expectedFixture.replace('-pretty.', '-minified.');
          await vscode.commands.executeCommand(c.command);
          assert.strictEqual(getActiveEditorText(), readFixture(expectedFixture));
        });

        test('no active editor — opens result in a new tab', async () => {
          await vscode.commands.executeCommand('workbench.action.closeAllEditors');
          await vscode.env.clipboard.writeText(readFixture('json-pretty.json'));
          await vscode.commands.executeCommand(c.command);
          assert.ok(vscode.window.activeTextEditor, 'Expected a new editor to be opened');
          assert.strictEqual(getActiveEditorText(), readFixture(c.expectedFixture));
        });

        test('cancelling Quick Pick — command resolves without throwing', async () => {
          quickPickResponse = undefined;
          await vscode.env.clipboard.writeText(readFixture('json-pretty.json'));
          await assert.doesNotReject(Promise.resolve(vscode.commands.executeCommand(c.command)));
        });

        test('empty clipboard — command resolves without throwing', async () => {
          await vscode.env.clipboard.writeText('');
          await assert.doesNotReject(Promise.resolve(vscode.commands.executeCommand(c.command)));
        });

        test('invalid content — command resolves without throwing', async () => {
          await vscode.env.clipboard.writeText('not valid json or xml or yaml: {{{');
          await assert.doesNotReject(Promise.resolve(vscode.commands.executeCommand(c.command)));
        });
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

    test('format command leaves document unchanged when document is readonly', async () => {
      const content = readFixture('json-minified.json');
      const editor = await openEditorWithContent(content);
      await vscode.commands.executeCommand(
        'workbench.action.files.setActiveEditorReadonlyInSession',
      );
      await vscode.commands.executeCommand('xyjson.formatJson');
      assert.strictEqual(getEditorText(editor), content);
    });
  });
});
