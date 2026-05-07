import * as vscode from 'vscode';

import type { SupportedFormat } from './converter';
import { convert } from './converter';

type Action = 'convert' | 'format';

async function convertAndReplace(to: SupportedFormat, action: Action): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  const label = action === 'format' ? 'Formatting' : 'Conversion';

  if (!editor) {
    vscode.window.showErrorMessage(`${label} failed: No active editor found`);
    return;
  }

  const document = editor.document;
  const documentVersion = document.version;
  const selection = editor.selection;
  const hasSelection = !selection.isEmpty;

  const content = hasSelection ? document.getText(selection).trim() : document.getText().trim();

  if (!content) {
    vscode.window.showErrorMessage(`${label} failed: Document is empty`);
    return;
  }

  const config = vscode.workspace.getConfiguration('xyjson', document.uri);
  const outputStyle = config.get<'ask' | 'pretty' | 'minified'>('outputStyle', 'ask');
  const indentSize = config.get<number>('indentSize', 2);
  const attributeNamePrefix = config.get<string>('xmlAttributeNamePrefix', '@_');

  let minify: boolean;
  if (outputStyle === 'minified') {
    minify = true;
  } else if (outputStyle === 'pretty') {
    minify = false;
  } else {
    const pick = await vscode.window.showQuickPick(
      [
        { label: 'Pretty', description: 'indented with newlines' },
        { label: 'Minified', description: 'single line, no whitespace' },
      ],
      {
        placeHolder: 'Select output format',
        title:
          action === 'format' ? `Format ${to.toUpperCase()}` : `Convert to ${to.toUpperCase()}`,
      },
    );
    if (pick === undefined) {
      return;
    }
    minify = pick.label === 'Minified';
  }

  try {
    const result = convert(content, to, { minify, indentSize, attributeNamePrefix });

    if (action === 'convert') {
      const convertOutput = config.get<'newTab' | 'beside'>('convertOutput', 'newTab');
      const doc = await vscode.workspace.openTextDocument({ content: result, language: to });
      const showOptions: vscode.TextDocumentShowOptions = { preview: false };
      if (convertOutput === 'beside') {
        showOptions.viewColumn = vscode.ViewColumn.Beside;
      }
      await vscode.window.showTextDocument(doc, showOptions);
    } else {
      // showQuickPick is async; guard against document state changes while picker was open.
      // Selection is only checked when there was an initial selection — a cursor move on a
      // whole-document format is harmless and should not abort the operation.
      if (
        document.isClosed ||
        vscode.window.activeTextEditor?.document !== document ||
        document.version !== documentVersion ||
        (hasSelection && !editor.selection.isEqual(selection))
      ) {
        vscode.window.showErrorMessage(`${label} failed: document state changed`);
        return;
      }
      const replaceRange = hasSelection
        ? selection
        : new vscode.Range(
            document.lineAt(0).range.start,
            document.lineAt(document.lineCount - 1).range.end,
          );
      const applied = await editor.edit((editBuilder) => {
        editBuilder.replace(replaceRange, result);
      });
      if (!applied) {
        vscode.window.showErrorMessage(`${label} failed: Could not apply edits`);
        return;
      }
    }

    vscode.window.showInformationMessage(
      action === 'format'
        ? `Formatted ${to} (${minify ? 'minified' : 'pretty'})`
        : `Converted to ${to} (${minify ? 'minified' : 'pretty'})`,
    );
  } catch (err) {
    vscode.window.showErrorMessage(
      `${label} failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

async function convertFromClipboard(to: SupportedFormat): Promise<void> {
  const content = (await vscode.env.clipboard.readText()).trim();
  if (!content) {
    vscode.window.showErrorMessage('Conversion failed: Clipboard is empty');
    return;
  }

  const config = vscode.workspace.getConfiguration('xyjson');
  const outputStyle = config.get<'ask' | 'pretty' | 'minified'>('outputStyle', 'ask');
  const indentSize = config.get<number>('indentSize', 2);
  const attributeNamePrefix = config.get<string>('xmlAttributeNamePrefix', '@_');

  let minify: boolean;
  if (outputStyle === 'minified') {
    minify = true;
  } else if (outputStyle === 'pretty') {
    minify = false;
  } else {
    const pick = await vscode.window.showQuickPick(
      [
        { label: 'Pretty', description: 'indented with newlines' },
        { label: 'Minified', description: 'single line, no whitespace' },
      ],
      {
        placeHolder: 'Select output format',
        title: `Paste Clipboard as ${to.toUpperCase()}`,
      },
    );
    if (pick === undefined) {
      return;
    }
    minify = pick.label === 'Minified';
  }

  try {
    const result = convert(content, to, { minify, indentSize, attributeNamePrefix });
    const convertOutput = config.get<'newTab' | 'beside'>('convertOutput', 'newTab');
    const doc = await vscode.workspace.openTextDocument({ content: result, language: to });
    const showOptions: vscode.TextDocumentShowOptions = { preview: false };
    if (convertOutput === 'beside') {
      showOptions.viewColumn = vscode.ViewColumn.Beside;
    }
    await vscode.window.showTextDocument(doc, showOptions);
    vscode.window.showInformationMessage(
      `Pasted clipboard as ${to} (${minify ? 'minified' : 'pretty'})`,
    );
  } catch (err) {
    vscode.window.showErrorMessage(
      `Conversion failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('xyjson.toJson', () => convertAndReplace('json', 'convert')),
    vscode.commands.registerCommand('xyjson.toXml', () => convertAndReplace('xml', 'convert')),
    vscode.commands.registerCommand('xyjson.toYaml', () => convertAndReplace('yaml', 'convert')),
    vscode.commands.registerCommand('xyjson.formatJson', () => convertAndReplace('json', 'format')),
    vscode.commands.registerCommand('xyjson.formatXml', () => convertAndReplace('xml', 'format')),
    vscode.commands.registerCommand('xyjson.formatYaml', () => convertAndReplace('yaml', 'format')),
    vscode.commands.registerCommand('xyjson.clipboardToJson', () => convertFromClipboard('json')),
    vscode.commands.registerCommand('xyjson.clipboardToXml', () => convertFromClipboard('xml')),
    vscode.commands.registerCommand('xyjson.clipboardToYaml', () => convertFromClipboard('yaml')),
  );
}

export function deactivate() {}
