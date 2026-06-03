const esbuild = require("esbuild");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: 'esbuild-problem-matcher',

  setup(build) {
    build.onStart(() => {
      if (watch) {
        console.log('[watch] build started');
      }
    });
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        if (location) {
          console.error(`    ${location.file}:${location.line}:${location.column}:`);
        }
      });
      result.warnings.forEach(({ text, location }) => {
        console.warn(`⚠ [WARNING] ${text}`);
        if (location) {
          console.warn(`    ${location.file}:${location.line}:${location.column}:`);
        }
      });
      if (watch) {
        console.log('[watch] build finished');
      }
    });
  },
};

const options = {
  entryPoints: [
    'src/extension.ts'
  ],
  bundle: true,
  format: 'cjs',
  minify: production,
  sourcemap: !production,
  sourcesContent: false,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/extension.js',
  external: ['vscode'],
  logLevel: 'silent',
  plugins: [
    /* add to the end of plugins array */
    esbuildProblemMatcherPlugin,
  ],
};

async function main() {
  if (watch) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
  } else {
    try {
      await esbuild.build(options);
    } catch (err) {
      if (err.errors) {
        process.exitCode = 1;
        return;
      }
      throw err;
    }
  }
}

main().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
