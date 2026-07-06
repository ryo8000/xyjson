#!/usr/bin/env node
// PostToolUse hook (Edit|Write): auto-fix the edited file with ESLint.
// Exits 2 with the remaining problems on stderr so Claude sees them.
'use strict';

const { execFileSync } = require('node:child_process');
const path = require('node:path');

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
  const srcDir = path.join(projectDir, 'src') + path.sep;
  if (!path.resolve(filePath).startsWith(srcDir)) {
    process.exit(0);
  }

  try {
    execFileSync('npx', ['eslint', '--fix', filePath], {
      cwd: projectDir,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    const out = [err.stdout, err.stderr].filter(Boolean).join('\n').trim();
    process.stderr.write(out || `eslint failed: ${err.message}`);
    process.exit(2);
  }
});
