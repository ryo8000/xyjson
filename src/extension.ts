import * as vscode from 'vscode';

import { convert, SupportedFormat } from './converter';

async function convertAndReplace(to: SupportedFormat): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('Conversion failed: No active editor found');
    return;
  }

  const document = editor.document;
  const selection = editor.selection;
  const hasSelection = !selection.isEmpty;

  const content = hasSelection
    ? document.getText(selection).trim()
    : document.getText().trim();

  if (!content) {
    vscode.window.showErrorMessage('Conversion failed: Document is empty');
    return;
  }

  const config = vscode.workspace.getConfiguration('xyjson');
  const minify = config.get<boolean>('minify', false);
  const attributeNamePrefix = config.get<string>('xmlAttributeNamePrefix', '@_');

  try {
    const result = convert(content, to, { minify, attributeNamePrefix });

    const replaceRange = hasSelection
      ? selection
      : new vscode.Range(
          document.lineAt(0).range.start,
          document.lineAt(document.lineCount - 1).range.end,
        );

    await editor.edit((editBuilder) => {
      editBuilder.replace(replaceRange, result);
    });

    vscode.window.showInformationMessage(
      `Converted to ${to} (${minify ? 'minified' : 'formatted'})`,
    );
  } catch (err: any) {
    vscode.window.showErrorMessage(`Conversion failed: ${err.message}`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('xyjson.toJson', () => convertAndReplace('json')),
    vscode.commands.registerCommand('xyjson.toXml', () => convertAndReplace('xml')),
    vscode.commands.registerCommand('xyjson.toYaml', () => convertAndReplace('yaml')),
  );
}

export function deactivate() {}
