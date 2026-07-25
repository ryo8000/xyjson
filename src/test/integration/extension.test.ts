import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

/**
 * Only behavior that needs a real VS Code host belongs here — command
 * registration, real editors/selections, the workspace configuration, the
 * clipboard, and the edit API. The command flow itself (empty input, Quick Pick
 * cancellation, error and success messages) is covered by the much faster
 * `src/test/unit/extension.test.ts`.
 */
suite('Extension Integration Test Suite', () => {
  let quickPickResponse: { label: string } | undefined = { label: 'Pretty' };
  const originalShowQuickPick = (vscode.window as any).showQuickPick;

  const readFixture = (filename: string): string =>
    fs.readFileSync(path.join(__dirname, '../fixtures', filename), 'utf-8').replace(/\r\n/g, '\n');

  const openEditorWithContent = async (content: string): Promise<vscode.TextEditor> => {
    const document = await vscode.workspace.openTextDocument({ content, language: 'plaintext' });
    return await vscode.window.showTextDocument(document);
  };

  const getEditorText = (editor: vscode.TextEditor): string =>
    editor.document.getText().replace(/\r\n/g, '\n');

  const getActiveEditorText = (): string => getEditorText(vscode.window.activeTextEditor!);

  const updateConfig = async (key: string, value: string | number): Promise<void> => {
    await vscode.workspace
      .getConfiguration('xyjson')
      .update(key, value, vscode.ConfigurationTarget.Global);
  };

  suiteSetup(async () => {
    // Pre-activate so the first test doesn't hit activation cost and time out (flaky).
    await vscode.extensions.getExtension('ryo8000.xyjson')?.activate();
    (vscode.window as any).showQuickPick = async () => quickPickResponse;
  });

  suiteTeardown(() => {
    (vscode.window as any).showQuickPick = originalShowQuickPick;
  });

  teardown(async () => {
    quickPickResponse = { label: 'Pretty' };
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    await updateConfig('outputStyle', 'ask');
    await updateConfig('convertOutput', 'newTab');
    await updateConfig('indentSize', 2);
    await updateConfig('xmlAttributeNamePrefix', '@_');
  });

  test('registers all public commands', async () => {
    const registeredCommands = await vscode.commands.getCommands(true);
    const expectedCommands = [
      'xyjson.toJson',
      'xyjson.toXml',
      'xyjson.toYaml',
      'xyjson.formatJson',
      'xyjson.formatXml',
      'xyjson.formatYaml',
      'xyjson.clipboardToJson',
      'xyjson.clipboardToXml',
      'xyjson.clipboardToYaml',
    ];
    for (const command of expectedCommands) {
      assert.ok(registeredCommands.includes(command), `Expected ${command} to be registered`);
    }
  });

  test('converts XML to JSON in a new editor', async () => {
    const sourceEditor = await openEditorWithContent(readFixture('xml-pretty.xml'));
    await vscode.commands.executeCommand('xyjson.toJson');
    assert.strictEqual(getActiveEditorText(), readFixture('json-pretty.json'));
    assert.strictEqual(getEditorText(sourceEditor), readFixture('xml-pretty.xml'));
    assert.strictEqual(vscode.window.activeTextEditor?.document.languageId, 'json');
  });

  test('formats the current document through the VS Code edit API', async () => {
    const editor = await openEditorWithContent(readFixture('json-minified.json'));
    await vscode.commands.executeCommand('xyjson.formatJson');
    assert.strictEqual(getEditorText(editor), readFixture('json-pretty.json'));
  });

  test('converts only the selected text', async () => {
    const json = readFixture('json-pretty.json');
    const prefix = 'prefix text\n';
    const suffix = '\nsuffix text';
    const editor = await openEditorWithContent(prefix + json + suffix);
    editor.selection = new vscode.Selection(
      editor.document.positionAt(prefix.length),
      editor.document.positionAt(prefix.length + json.length),
    );

    await vscode.commands.executeCommand('xyjson.toYaml');

    assert.strictEqual(getEditorText(editor), prefix + json + suffix);
    assert.strictEqual(getActiveEditorText(), readFixture('yaml-pretty.yaml'));
  });

  test('reads output and conversion settings from the workspace configuration', async () => {
    await updateConfig('outputStyle', 'pretty');
    await updateConfig('indentSize', 4);
    await updateConfig('xmlAttributeNamePrefix', '$');
    quickPickResponse = undefined;
    await openEditorWithContent(readFixture('xml-pretty.xml'));

    await vscode.commands.executeCommand('xyjson.toJson');

    const parsed = JSON.parse(getActiveEditorText());
    assert.strictEqual(parsed.profiles.$id, '1');
    assert.ok(getActiveEditorText().includes('    "name": "test"'));
  });

  test('opens converted output beside the source editor', async () => {
    await updateConfig('convertOutput', 'beside');
    const sourceEditor = await openEditorWithContent(readFixture('json-pretty.json'));
    await vscode.commands.executeCommand('xyjson.toYaml');
    assert.notStrictEqual(vscode.window.activeTextEditor?.viewColumn, sourceEditor.viewColumn);
  });

  test('uses the VS Code clipboard and opens output without an active editor', async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    await vscode.env.clipboard.writeText(readFixture('yaml-pretty.yaml'));
    await vscode.commands.executeCommand('xyjson.clipboardToXml');
    assert.strictEqual(getActiveEditorText(), readFixture('xml-pretty.xml'));
  });

  test('cancelling Quick Pick leaves the source document unchanged', async () => {
    quickPickResponse = undefined;
    const content = readFixture('json-pretty.json');
    const editor = await openEditorWithContent(content);
    await vscode.commands.executeCommand('xyjson.toYaml');
    assert.strictEqual(getEditorText(editor), content);
    assert.strictEqual(vscode.window.activeTextEditor, editor);
  });

  test('a readonly editor rejects formatting without changing the document', async () => {
    const content = readFixture('json-minified.json');
    const editor = await openEditorWithContent(content);
    await vscode.commands.executeCommand('workbench.action.files.setActiveEditorReadonlyInSession');
    await vscode.commands.executeCommand('xyjson.formatJson');
    assert.strictEqual(getEditorText(editor), content);
  });

  // The staleness guard reads live vscode state from inside the Quick Pick
  // callback, which unit tests cannot exercise — only the predicate itself is
  // covered there. These tests verify the wiring.
  suite('Format Command Guard Behavior', () => {
    test('leaves the document unchanged when the active editor changes during Quick Pick', async () => {
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

    test('leaves the document unchanged when it is edited during Quick Pick', async () => {
      const content = readFixture('json-minified.json');
      const editor = await openEditorWithContent(content);
      const suiteMock = (vscode.window as any).showQuickPick;
      let editedContent: string;

      (vscode.window as any).showQuickPick = async () => {
        const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
        await editor.edit((b) => {
          b.insert(lastLine.range.end, ' ');
        });
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

    test('leaves the document unchanged when the selection changes during Quick Pick', async () => {
      const content = readFixture('json-minified.json');
      const editor = await openEditorWithContent(content);
      const suiteMock = (vscode.window as any).showQuickPick;

      editor.selection = new vscode.Selection(
        editor.document.positionAt(0),
        editor.document.positionAt(content.length),
      );

      (vscode.window as any).showQuickPick = async () => {
        editor.selection = new vscode.Selection(
          new vscode.Position(0, 0),
          new vscode.Position(0, 0),
        );
        return { label: 'Pretty' };
      };

      try {
        await vscode.commands.executeCommand('xyjson.formatJson');
        assert.strictEqual(getEditorText(editor), content);
      } finally {
        (vscode.window as any).showQuickPick = suiteMock;
      }
    });

    test('formats the whole document when only the cursor moves during Quick Pick', async () => {
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
});
