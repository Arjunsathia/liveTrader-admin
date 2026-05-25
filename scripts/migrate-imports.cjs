const fs = require('fs');
const path = require('path');

const OLD_ALIASES = ['@app', '@features', '@components', '@api', '@config', '@hooks', '@utils', '@styles', '@assets'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Replace deep path alias prefixes: @features -> @/features
  for (const alias of OLD_ALIASES) {
    const regex = new RegExp(`(['"])${alias}\\/`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `$1@/${alias.replace('@', '')}/`);
      changed = true;
    }
    // Also replace exact matches: import { x } from '@features' -> '@/features'
    const exactRegex = new RegExp(`(['"])${alias}(['"])`, 'g');
    if (exactRegex.test(content)) {
      content = content.replace(exactRegex, `$1@/${alias.replace('@', '')}$2`);
      changed = true;
    }
  }

  if (changed) {
    console.log(`Updated imports in ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, '../src'));
