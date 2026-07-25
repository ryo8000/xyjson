/**
 * vscode-free command flow shared by the handlers in `extension.ts`.
 *
 * Keeping the orchestration out of the vscode-dependent module lets it run
 * under the lightweight `npm test` (mocha) suite instead of the heavy VS Code
 * integration runner. `extension.ts` stays a thin adapter that reads state from
 * the vscode API and injects the effects below.
 */

import type { SupportedFormat } from './converter';
import { convert } from './converter';

export type Action = 'convert' | 'format';
export type OutputStyle = 'ask' | 'pretty' | 'minified';
export type ConvertOutput = 'newTab' | 'beside';

export interface Config {
  outputStyle: OutputStyle;
  convertOutput: ConvertOutput;
  indentSize: number;
  attributeNamePrefix: string;
}

export interface QuickPickItem {
  label: 'Pretty' | 'Minified';
  description: string;
}

export type ShowQuickPick = (
  items: QuickPickItem[],
  options: { placeHolder: string; title: string },
) => Promise<QuickPickItem | undefined>;

export interface CommandDependencies {
  showQuickPick: ShowQuickPick;
  openConvertedDocument: (
    content: string,
    language: SupportedFormat,
    convertOutput: ConvertOutput,
  ) => Promise<void>;
  showErrorMessage: (message: string) => void;
  showInformationMessage: (message: string) => void;
}

/**
 * Decides whether output should be minified.
 *
 * Returns `true`/`false` directly for the fixed styles, and only falls back to
 * the Quick Pick for `'ask'`. Returns `undefined` when the user cancels,
 * signalling the caller to abort.
 */
export async function resolveMinify(
  outputStyle: OutputStyle,
  title: string,
  showQuickPick: ShowQuickPick,
): Promise<boolean | undefined> {
  if (outputStyle === 'minified') {
    return true;
  }
  if (outputStyle === 'pretty') {
    return false;
  }
  const pick = await showQuickPick(
    [
      { label: 'Pretty', description: 'indented with newlines' },
      { label: 'Minified', description: 'single line, no whitespace' },
    ],
    { placeHolder: 'Select output format', title },
  );
  return pick === undefined ? undefined : pick.label === 'Minified';
}

/**
 * Detects whether the document/editor state changed while the Quick Pick was
 * open, which would make applying an in-place edit unsafe.
 *
 * The selection is only considered when there was an initial selection — a
 * cursor move on a whole-document format is harmless and must not abort.
 *
 * Generic over the document/selection types so the real vscode objects satisfy
 * the structural constraints without this module importing vscode.
 */
export function isDocumentStateStale<
  TDocument extends { isClosed: boolean; version: number },
  TSelection extends { isEqual: (other: TSelection) => boolean },
>({
  document,
  activeDocument,
  initialVersion,
  initialSelection,
  currentSelection,
  hasSelection,
}: {
  document: TDocument;
  activeDocument: TDocument | undefined;
  initialVersion: number;
  initialSelection: TSelection;
  currentSelection: TSelection;
  hasSelection: boolean;
}): boolean {
  return (
    document.isClosed ||
    activeDocument !== document ||
    document.version !== initialVersion ||
    (hasSelection && !currentSelection.isEqual(initialSelection))
  );
}

export interface FormatTarget {
  isStale: () => boolean;
  replace: (content: string) => Promise<boolean>;
}

export type EditorCommand = {
  content: string;
  to: SupportedFormat;
  config: Config;
} & ({ action: 'convert' } | { action: 'format'; formatTarget: FormatTarget });

export async function executeEditorCommand(
  command: EditorCommand,
  dependencies: CommandDependencies,
): Promise<void> {
  const label = command.action === 'format' ? 'Formatting' : 'Conversion';

  const content = command.content.trim();
  if (content === '') {
    dependencies.showErrorMessage(`${label} failed: Document is empty`);
    return;
  }

  const upperCased = command.to.toUpperCase();
  const minify = await resolveMinify(
    command.config.outputStyle,
    command.action === 'format' ? `Format ${upperCased}` : `Convert to ${upperCased}`,
    dependencies.showQuickPick,
  );
  if (minify === undefined) {
    return;
  }

  try {
    const result = convert(content, command.to, {
      minify,
      indentSize: command.config.indentSize,
      attributeNamePrefix: command.config.attributeNamePrefix,
    });

    if (command.action === 'convert') {
      await dependencies.openConvertedDocument(result, command.to, command.config.convertOutput);
    } else {
      // showQuickPick is async; guard against document state changes while the picker was open.
      if (command.formatTarget.isStale()) {
        dependencies.showErrorMessage(`${label} failed: document state changed`);
        return;
      }
      if (!(await command.formatTarget.replace(result))) {
        dependencies.showErrorMessage(`${label} failed: Could not apply edits`);
        return;
      }
    }

    dependencies.showInformationMessage(
      command.action === 'format'
        ? `Formatted ${command.to} (${minify ? 'minified' : 'pretty'})`
        : `Converted to ${command.to} (${minify ? 'minified' : 'pretty'})`,
    );
  } catch (err) {
    dependencies.showErrorMessage(
      `${label} failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

export interface ClipboardCommand {
  content: string;
  to: SupportedFormat;
  config: Config;
}

export async function executeClipboardCommand(
  command: ClipboardCommand,
  dependencies: CommandDependencies,
): Promise<void> {
  const content = command.content.trim();
  if (content === '') {
    dependencies.showErrorMessage('Conversion failed: Clipboard is empty');
    return;
  }

  const minify = await resolveMinify(
    command.config.outputStyle,
    `Paste Clipboard as ${command.to.toUpperCase()}`,
    dependencies.showQuickPick,
  );
  if (minify === undefined) {
    return;
  }

  try {
    const result = convert(content, command.to, {
      minify,
      indentSize: command.config.indentSize,
      attributeNamePrefix: command.config.attributeNamePrefix,
    });
    await dependencies.openConvertedDocument(result, command.to, command.config.convertOutput);
    dependencies.showInformationMessage(
      `Pasted clipboard as ${command.to} (${minify ? 'minified' : 'pretty'})`,
    );
  } catch (err) {
    dependencies.showErrorMessage(
      `Conversion failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}
