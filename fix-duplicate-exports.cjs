const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const defaultExportMatch = content.match(/export\s+default\s+([A-Za-z0-9_]+)/);
  if (defaultExportMatch) {
    const componentName = defaultExportMatch[1];
    const namedExportRegex = new RegExp(`export\\s+function\\s+${componentName}\\s*\\(`, 'g');
    if (namedExportRegex.test(content)) {
      console.log(`Fixing duplicate export in: ${filePath}`);
      content = content.replace(namedExportRegex, `function ${componentName}(`);
      fs.writeFileSync(filePath, content, 'utf-8');
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
