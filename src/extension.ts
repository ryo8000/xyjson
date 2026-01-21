import * as vscode from 'vscode';
import { convert } from './converter';
import { SupportedFormat } from './types';

async function convertAndReplace(to: SupportedFormat): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('Conversion failed: No active editor found');
    return;
  }

  const document = editor.document;
  const content = document.getText().trim();

  if (!content) {
    vscode.window.showErrorMessage('Conversion failed: Document is empty');
    return;
  }

  try {
    const result = convert(content, to);

    const fullRange = new vscode.Range(
      document.lineAt(0).range.start,
      document.lineAt(document.lineCount - 1).range.end,
    );

    await editor.edit((editBuilder) => {
      editBuilder.replace(fullRange, result);
    });

    vscode.window.showInformationMessage(`Converted to ${to}`);
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
