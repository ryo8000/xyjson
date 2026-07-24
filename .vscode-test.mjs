import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	// Give activation and each test headroom over Mocha's 2000ms default, which
	// flaked on cold CI runners (hooks are timeout-bound too).
	mocha: { timeout: 20000 },
});
