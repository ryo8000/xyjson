#!/usr/bin/env node
// PostToolUse hook (Edit|Write): auto-fix the edited file with ESLint.
// Exits 2 with the remaining problems on stderr so Claude sees them.
'use strict';

const { execFileSync } = require('node:child_process');
const path = require('node:path');

process.stdin.setEncoding('utf8');
let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
  let filePath;
  try {
    filePath = JSON.parse(input).tool_input?.file_path;
  } catch {
    process.exit(0);
  }
  if (typeof filePath !== 'string' || !filePath.endsWith('.ts')) {
    process.exit(0);
  }

  const projectDir = path.resolve(__dirname, '..', '..');
  const srcDir = path.join(projectDir, 'src');
  const resolvedFilePath = path.resolve(projectDir, filePath);
  const relative = path.relative(srcDir, resolvedFilePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    process.exit(0);
  }

  let eslintCli;
  try {
    eslintCli = path.join(path.dirname(require.resolve('eslint/package.json')), 'bin', 'eslint.js');
  } catch {
    process.exit(0);
  }

  try {
    execFileSync(process.execPath, [eslintCli, '--fix', resolvedFilePath], {
      cwd: projectDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
    });
  } catch (err) {
    const out = [err.stdout, err.stderr].filter(Boolean).join('\n').trim();
    process.stderr.write((out || `eslint failed: ${err.message}`) + '\n');
    process.exitCode = 2;
  }
});
