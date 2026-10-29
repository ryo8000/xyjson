const esbuild = require("esbuild");
const fs = require('fs');
const path = require('path');

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

/**
 * @type {import('esbuild').Plugin}
 */
const thirdPartyNoticesPlugin = {
  name: 'third-party-notices',

  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length > 0) {
        return;
      }
      const packageDirs = new Set();
      for (const input of Object.keys(result.metafile.inputs)) {
        const match = input.match(/^(.*node_modules\/(?:@[^/]+\/)?[^/]+)\//);
        if (match) {
          packageDirs.add(match[1]);
        }
      }
      const notices = [...packageDirs].sort().map((dir) => {
        const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
        const licenseFile = fs.readdirSync(dir).find((file) => /^(licen[cs]e|copying)/i.test(file));
        const text = licenseFile
          ? fs.readFileSync(path.join(dir, licenseFile), 'utf8').trim()
          : `License: ${pkg.license}\nAuthor: ${pkg.author?.name ?? pkg.author}`;
        return `${pkg.name}@${pkg.version}\n\n${text}`;
      });
      fs.writeFileSync(
        path.join(path.dirname(build.initialOptions.outfile), 'ThirdPartyNotices.txt'),
        `This extension bundles the following third-party packages.\n\n${notices.join(`\n\n${'-'.repeat(80)}\n\n`)}\n`
      );
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
  metafile: true,
  plugins: [
    thirdPartyNoticesPlugin,
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
      if (err && typeof err === 'object' && 'errors' in err) {
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
