import * as assert from 'assert';

import type { SupportedFormat } from '../../converter';
import type { CommandDependencies, Config, QuickPickItem } from '../../extensionCore';
import {
  executeClipboardCommand,
  executeEditorCommand,
  isDocumentStateStale,
  resolveMinify,
} from '../../extensionCore';

suite('Extension Core Test Suite', () => {
  const config: Config = {
    outputStyle: 'ask',
    convertOutput: 'newTab',
    indentSize: 2,
    attributeNamePrefix: '@_',
  };

  const createHarness = (
    overrides: Partial<CommandDependencies> = {},
  ): {
    dependencies: CommandDependencies;
    errors: string[];
    information: string[];
    opened: { content: string; language: SupportedFormat; convertOutput: string }[];
  } => {
    const errors: string[] = [];
    const information: string[] = [];
    const opened: { content: string; language: SupportedFormat; convertOutput: string }[] = [];
    const dependencies: CommandDependencies = {
      showQuickPick: async () => ({ label: 'Pretty', description: '' }),
      openConvertedDocument: async (content, language, convertOutput) => {
        opened.push({ content, language, convertOutput });
      },
      showErrorMessage: (message) => {
        errors.push(message);
      },
      showInformationMessage: (message) => {
        information.push(message);
      },
      ...overrides,
    };
    return { dependencies, errors, information, opened };
  };

  suite('resolveMinify', () => {
    const failIfPrompted = async (): Promise<QuickPickItem | undefined> => {
      throw new Error('Quick Pick should not be shown');
    };

    test('returns true for "minified" without prompting', async () => {
      assert.strictEqual(await resolveMinify('minified', 'title', failIfPrompted), true);
    });

    test('returns false for "pretty" without prompting', async () => {
      assert.strictEqual(await resolveMinify('pretty', 'title', failIfPrompted), false);
    });

    test('returns the choice made for "ask"', async () => {
      assert.strictEqual(
        await resolveMinify('ask', 'title', async () => ({ label: 'Minified', description: '' })),
        true,
      );
      assert.strictEqual(
        await resolveMinify('ask', 'title', async () => ({ label: 'Pretty', description: '' })),
        false,
      );
    });

    test('returns undefined when the Quick Pick is cancelled', async () => {
      assert.strictEqual(await resolveMinify('ask', 'title', async () => undefined), undefined);
    });

    test('passes the choices and title to the Quick Pick', async () => {
      let labels: string[] = [];
      let title = '';
      await resolveMinify('ask', 'Convert to JSON', async (items, options) => {
        labels = items.map((item) => item.label);
        title = options.title;
        return undefined;
      });
      assert.deepStrictEqual(labels, ['Pretty', 'Minified']);
      assert.strictEqual(title, 'Convert to JSON');
    });
  });

  suite('isDocumentStateStale', () => {
    interface FakeDocument {
      isClosed: boolean;
      version: number;
    }

    interface FakeSelection {
      isEqual: (other: FakeSelection) => boolean;
    }

    interface StaleArgs {
      document: FakeDocument;
      activeDocument: FakeDocument | undefined;
      initialVersion: number;
      initialSelection: FakeSelection;
      currentSelection: FakeSelection;
      hasSelection: boolean;
    }

    // Structural stand-in for vscode.Selection: two selections are equal only
    // when they are the same object, mirroring a selection that never moved.
    const createSelection = (): FakeSelection => {
      const self: FakeSelection = { isEqual: (other: FakeSelection): boolean => other === self };
      return self;
    };

    const createArgs = (): StaleArgs => {
      const document = { isClosed: false, version: 1 };
      const selection = createSelection();
      return {
        document,
        activeDocument: document,
        initialVersion: 1,
        initialSelection: selection,
        currentSelection: selection,
        hasSelection: true,
      };
    };

    test('returns false when the document state is unchanged', () => {
      assert.strictEqual(isDocumentStateStale(createArgs()), false);
    });

    test('detects a closed document', () => {
      const args = createArgs();
      args.document.isClosed = true;
      assert.strictEqual(isDocumentStateStale(args), true);
    });

    test('detects the active editor moving to another document', () => {
      const args = createArgs();
      args.activeDocument = undefined;
      assert.strictEqual(isDocumentStateStale(args), true);
    });

    test('detects a document version change', () => {
      const args = createArgs();
      args.document.version = 2;
      assert.strictEqual(isDocumentStateStale(args), true);
    });

    test('detects a selection change when text was initially selected', () => {
      const args = createArgs();
      args.currentSelection = createSelection();
      assert.strictEqual(isDocumentStateStale(args), true);
    });

    test('allows a cursor move when there was no initial selection', () => {
      const args = createArgs();
      args.currentSelection = createSelection();
      args.hasSelection = false;
      assert.strictEqual(isDocumentStateStale(args), false);
    });
  });

  suite('executeEditorCommand', () => {
    test('rejects whitespace-only content before prompting', async () => {
      let prompted = false;
      const harness = createHarness({
        showQuickPick: async () => {
          prompted = true;
          return undefined;
        },
      });
      await executeEditorCommand(
        { content: ' \n ', to: 'json', action: 'convert', config },
        harness.dependencies,
      );
      assert.deepStrictEqual(harness.errors, ['Conversion failed: Document is empty']);
      assert.strictEqual(prompted, false);
    });

    test('does nothing when the Quick Pick is cancelled', async () => {
      const harness = createHarness({ showQuickPick: async () => undefined });
      await executeEditorCommand(
        { content: '{"a":1}', to: 'yaml', action: 'convert', config },
        harness.dependencies,
      );
      assert.strictEqual(harness.opened.length, 0);
      assert.strictEqual(harness.information.length, 0);
    });

    test('trims input and applies the configured style, indent size and output target', async () => {
      const harness = createHarness();
      await executeEditorCommand(
        {
          content: '  {"a":{"b":1}} \n',
          to: 'json',
          action: 'convert',
          config: { ...config, outputStyle: 'pretty', convertOutput: 'beside', indentSize: 4 },
        },
        harness.dependencies,
      );
      assert.deepStrictEqual(harness.opened, [
        {
          content: '{\n    "a": {\n        "b": 1\n    }\n}\n',
          language: 'json',
          convertOutput: 'beside',
        },
      ]);
      assert.deepStrictEqual(harness.information, ['Converted to json (pretty)']);
    });

    test('does not format when the document state became stale', async () => {
      let replaced = false;
      const harness = createHarness();
      await executeEditorCommand(
        {
          content: '{"a":1}',
          to: 'json',
          action: 'format',
          config,
          formatTarget: {
            isStale: () => true,
            replace: async () => {
              replaced = true;
              return true;
            },
          },
        },
        harness.dependencies,
      );
      assert.strictEqual(replaced, false);
      assert.deepStrictEqual(harness.errors, ['Formatting failed: document state changed']);
    });

    test('reports when a format edit cannot be applied', async () => {
      const harness = createHarness();
      await executeEditorCommand(
        {
          content: '{"a":1}',
          to: 'json',
          action: 'format',
          config,
          formatTarget: { isStale: () => false, replace: async () => false },
        },
        harness.dependencies,
      );
      assert.deepStrictEqual(harness.errors, ['Formatting failed: Could not apply edits']);
      assert.strictEqual(harness.information.length, 0);
    });

    test('replaces the content and reports a successful format', async () => {
      let replacement = '';
      const harness = createHarness();
      await executeEditorCommand(
        {
          content: '{"a":1}',
          to: 'json',
          action: 'format',
          config: { ...config, outputStyle: 'pretty' },
          formatTarget: {
            isStale: () => false,
            replace: async (content) => {
              replacement = content;
              return true;
            },
          },
        },
        harness.dependencies,
      );
      assert.strictEqual(replacement, '{\n  "a": 1\n}\n');
      assert.deepStrictEqual(harness.information, ['Formatted json (pretty)']);
    });

    test('reports a conversion error without opening a document', async () => {
      const harness = createHarness();
      await executeEditorCommand(
        { content: 'not valid json or xml or yaml: {{{', to: 'yaml', action: 'convert', config },
        harness.dependencies,
      );
      assert.strictEqual(harness.errors.length, 1);
      assert.ok((harness.errors[0] ?? '').startsWith('Conversion failed: '));
      assert.strictEqual(harness.opened.length, 0);
    });
  });

  suite('executeClipboardCommand', () => {
    test('rejects an empty clipboard', async () => {
      const harness = createHarness();
      await executeClipboardCommand({ content: ' \n ', to: 'json', config }, harness.dependencies);
      assert.deepStrictEqual(harness.errors, ['Conversion failed: Clipboard is empty']);
      assert.strictEqual(harness.opened.length, 0);
    });

    test('converts clipboard content and opens a document', async () => {
      const harness = createHarness();
      await executeClipboardCommand(
        { content: ' {"a":1} ', to: 'json', config: { ...config, outputStyle: 'minified' } },
        harness.dependencies,
      );
      assert.deepStrictEqual(harness.opened, [
        { content: '{"a":1}', language: 'json', convertOutput: 'newTab' },
      ]);
      assert.deepStrictEqual(harness.information, ['Pasted clipboard as json (minified)']);
    });

    test('does nothing when the Quick Pick is cancelled', async () => {
      const harness = createHarness({ showQuickPick: async () => undefined });
      await executeClipboardCommand(
        { content: '{"a":1}', to: 'json', config },
        harness.dependencies,
      );
      assert.strictEqual(harness.opened.length, 0);
      assert.strictEqual(harness.information.length, 0);
    });
  });
});
