const fs = require('fs');

fs.cpSync('src/test/fixtures', 'out/test/fixtures', { recursive: true });
