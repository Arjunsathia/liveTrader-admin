import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, 'src');
const ADMIN_DIR = path.join(SRC_DIR, 'admin');

// 1. Delete redundant folders
const redundantDirs = [
  'features',
  'pages',
  'layouts',
  'services',
  'hooks',
  'utils', // Wait, we need to keep tokens.js. Let's merge instead.
  'app',
  'layout'
];

for (const dir of redundantDirs) {
  const fullPath = path.join(SRC_DIR, dir);
  if (dir === 'utils') {
    // delete everything in utils EXCEPT tokens.js
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath);
      for (const file of files) {
        if (file !== 'tokens.js') {
          fs.rmSync(path.join(fullPath, file), { recursive: true, force: true });
        }
      }
    }
  } else {
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  }
}

// 2. Move admin contents to src
function moveContents(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) return;
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }
  const items = fs.readdirSync(srcPath);
  for (const item of items) {
    const s = path.join(srcPath, item);
    const d = path.join(destPath, item);
    if (fs.statSync(s).isDirectory()) {
      moveContents(s, d);
    } else {
      fs.renameSync(s, d);
    }
  }
}

console.log('Moving app...');
moveContents(path.join(ADMIN_DIR, 'app'), path.join(SRC_DIR, 'app'));
console.log('Moving features...');
moveContents(path.join(ADMIN_DIR, 'features'), path.join(SRC_DIR, 'features'));
console.log('Moving hooks...');
moveContents(path.join(ADMIN_DIR, 'hooks'), path.join(SRC_DIR, 'hooks'));
console.log('Moving layout...');
moveContents(path.join(ADMIN_DIR, 'layout'), path.join(SRC_DIR, 'layout'));
console.log('Moving services...');
moveContents(path.join(ADMIN_DIR, 'services'), path.join(SRC_DIR, 'services'));
console.log('Moving utils...');
moveContents(path.join(ADMIN_DIR, 'utils'), path.join(SRC_DIR, 'utils'));
console.log('Moving components...');
moveContents(path.join(ADMIN_DIR, 'components'), path.join(SRC_DIR, 'components'));

// 3. Delete admin dir
fs.rmSync(ADMIN_DIR, { recursive: true, force: true });

// 4. Update imports in all files
function updateImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updateImports(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Rule: Reduce `../` by one for any `components/ui` path because 
      // the requesting file moved up one folder, but `components/ui` did not.
      const uiRegex = /(?:\.\.\/)+components\/ui\//g;
      if (uiRegex.test(content)) {
        content = content.replace(uiRegex, (match) => match.substring(3));
        changed = true;
      }
      
      // We should also check for `../../components/ui` in deeply nested folders
      // Wait, regex /(?:\.\.\/)+components\/ui\//g matches any sequence of ../
      // substring(3) safely removes exactly one "../".

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated imports in ${fullPath}`);
      }
    }
  }
}

updateImports(SRC_DIR);

// 5. Update App.jsx and main.jsx specifically
const appJsxPath = path.join(SRC_DIR, 'App.jsx');
if (fs.existsSync(appJsxPath)) {
  let content = fs.readFileSync(appJsxPath, 'utf8');
  content = content.replace(/\.\/admin\//g, './');
  fs.writeFileSync(appJsxPath, content, 'utf8');
  console.log('Updated App.jsx');
}

console.log('Migration complete!');
