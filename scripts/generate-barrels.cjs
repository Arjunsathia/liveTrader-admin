const fs = require('fs');
const path = require('path');

function getExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const exports = [];
  
  // Match named exports: export function X, export const X
  let match;
  const namedRegex = /export\s+(?:function|const|let|var)\s+([A-Za-z0-9_]+)/g;
  while ((match = namedRegex.exec(content)) !== null) {
    exports.push({ name: match[1], type: 'named' });
  }

  // Match default export: export default X
  const defaultRegex = /export\s+default\s+([A-Za-z0-9_]+)/;
  const defaultMatch = content.match(defaultRegex);
  if (defaultMatch) {
    exports.push({ name: defaultMatch[1], type: 'default' });
  }

  return exports;
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let hasExports = false;
  let indexLines = [];

  for (const item of items) {
    if (item === 'index.js') continue;

    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
      // If the subdirectory has an index.js, we can export from it
      if (fs.existsSync(path.join(fullPath, 'index.js'))) {
        indexLines.push(`export * from './${item}';`);
        hasExports = true;
      }
    } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
      const fileExports = getExports(fullPath);
      if (fileExports.length > 0) {
        const basename = path.basename(item, path.extname(item));
        const namedList = fileExports.filter(e => e.type === 'named').map(e => e.name);
        const defaultEx = fileExports.find(e => e.type === 'default');

        if (defaultEx) {
           indexLines.push(`export { default as ${defaultEx.name} } from './${basename}';`);
        }
        if (namedList.length > 0) {
           indexLines.push(`export { ${namedList.join(', ')} } from './${basename}';`);
        }
        hasExports = true;
      }
    }
  }

  if (hasExports) {
    const indexPath = path.join(dirPath, 'index.js');
    fs.writeFileSync(indexPath, indexLines.join('\n') + '\n', 'utf-8');
    console.log(`Generated barrel: ${indexPath}`);
  }
}

// Generate barrels for all feature folders
const featuresPath = path.join(__dirname, '../src/features');
const features = fs.readdirSync(featuresPath);
for (const feature of features) {
  const featureDir = path.join(featuresPath, feature);
  if (fs.statSync(featureDir).isDirectory()) {
    processDirectory(featureDir);
  }
}
