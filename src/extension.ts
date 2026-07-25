import * as vscode from 'vscode';

import type { SupportedFormat } from './converter';
import type {
  Action,
  CommandDependencies,
  Config,
  ConvertOutput,
  FormatTarget,
  OutputStyle,
} from './extensionCore';
import {
  executeClipboardCommand,
  executeEditorCommand,
  isDocumentStateStale,
} from './extensionCore';

function readConfig(resource?: vscode.Uri): Config {
  const config = vscode.workspace.getConfiguration('xyjson', resource);
  return {
    outputStyle: config.get<OutputStyle>('outputStyle', 'ask'),
    convertOutput: config.get<ConvertOutput>('convertOutput', 'newTab'),
    indentSize: config.get<number>('indentSize', 2),
    attributeNamePrefix: config.get<string>('xmlAttributeNamePrefix', '@_'),
  };
}

async function openConvertedDocument(
  content: string,
  language: SupportedFormat,
  convertOutput: ConvertOutput,
): Promise<void> {
  const doc = await vscode.workspace.openTextDocument({ content, language });
  const showOptions: vscode.TextDocumentShowOptions = { preview: false };
  if (convertOutput === 'beside') {
    showOptions.viewColumn = vscode.ViewColumn.Beside;
  }
  await vscode.window.showTextDocument(doc, showOptions);
}

const dependencies: CommandDependencies = {
  showQuickPick: async (items, options) => await vscode.window.showQuickPick(items, options),
  openConvertedDocument,
  showErrorMessage: (message) => {
    vscode.window.showErrorMessage(message);
  },
  showInformationMessage: (message) => {
    vscode.window.showInformationMessage(message);
  },
};

function createFormatTarget(editor: vscode.TextEditor): FormatTarget {
  const { document, selection } = editor;
  const initialVersion = document.version;
  const hasSelection = !selection.isEmpty;

  return {
    isStale: () =>
      isDocumentStateStale({
        document,
        activeDocument: vscode.window.activeTextEditor?.document,
        initialVersion,
        initialSelection: selection,
        currentSelection: editor.selection,
        hasSelection,
      }),
    replace: async (content) => {
      const replaceRange = hasSelection
        ? selection
        : new vscode.Range(
            document.lineAt(0).range.start,
            document.lineAt(document.lineCount - 1).range.end,
          );
      return await editor.edit((editBuilder) => {
        editBuilder.replace(replaceRange, content);
      });
    },
  };
}

async function convertAndReplace(to: SupportedFormat, action: Action): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (editor === undefined) {
    const label = action === 'format' ? 'Formatting' : 'Conversion';
    vscode.window.showErrorMessage(`${label} failed: No active editor found`);
    return;
  }

  const { document, selection } = editor;
  const content = selection.isEmpty ? document.getText() : document.getText(selection);
  const config = readConfig(document.uri);

  await executeEditorCommand(
    action === 'format'
      ? { content, to, config, action, formatTarget: createFormatTarget(editor) }
      : { content, to, config, action },
    dependencies,
  );
}

async function convertFromClipboard(to: SupportedFormat): Promise<void> {
  await executeClipboardCommand(
    {
      content: await vscode.env.clipboard.readText(),
      to,
      config: readConfig(vscode.window.activeTextEditor?.document.uri),
    },
    dependencies,
  );
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('xyjson.toJson', async () => {
      await convertAndReplace('json', 'convert');
    }),
    vscode.commands.registerCommand('xyjson.toXml', async () => {
      await convertAndReplace('xml', 'convert');
    }),
    vscode.commands.registerCommand('xyjson.toYaml', async () => {
      await convertAndReplace('yaml', 'convert');
    }),
    vscode.commands.registerCommand('xyjson.formatJson', async () => {
      await convertAndReplace('json', 'format');
    }),
    vscode.commands.registerCommand('xyjson.formatXml', async () => {
      await convertAndReplace('xml', 'format');
    }),
    vscode.commands.registerCommand('xyjson.formatYaml', async () => {
      await convertAndReplace('yaml', 'format');
    }),
    vscode.commands.registerCommand('xyjson.clipboardToJson', async () => {
      await convertFromClipboard('json');
    }),
    vscode.commands.registerCommand('xyjson.clipboardToXml', async () => {
      await convertFromClipboard('xml');
    }),
    vscode.commands.registerCommand('xyjson.clipboardToYaml', async () => {
      await convertFromClipboard('yaml');
    }),
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate(): void {}
