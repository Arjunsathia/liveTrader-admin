const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Regex to find: const [drawer, setDrawer] = useState(null);
  // Match groups: 1=var name, 2=setter name
  const stateRegex = /const \[([a-zA-Z0-9_]+),\s*([a-zA-Z0-9_]+)\]\s*=\s*useState\(null\);/g;
  
  let match;
  let hasChanges = false;
  let needsDrawerStateImport = false;

  while ((match = stateRegex.exec(originalContent)) !== null) {
    const varName = match[1];
    const setterName = match[2];

    // Check if this variable is used as a drawer prop (open={!!varName})
    if (content.includes('open={!!' + varName + '}') || content.includes('open={Boolean(' + varName + ')}')) {
      hasChanges = true;
      needsDrawerStateImport = true;

      // 1. Replace the state declaration
      content = content.replace(match[0], 'const ' + varName + 'State = useDrawerState(null);');

      // 2. Replace the setter usages: setDrawer(val) -> drawerState.open(val)
      const setterRegex = new RegExp(setterName + '\\(([^)]+)\\)', 'g');
      content = content.replace(setterRegex, (m, arg) => {
        if (arg === 'null' || arg === 'false') return varName + 'State.close()';
        return varName + 'State.open(' + arg + ')';
      });

      // 3. Replace the Drawer props
      // open={!!drawer} row={drawer} onClose={() => setDrawer(null)}
      const openRegex1 = new RegExp('open=\\{\\!\\!' + varName + '\\}', 'g');
      const openRegex2 = new RegExp('open=\\{Boolean\\(' + varName + '\\)\\}', 'g');
      content = content.replace(openRegex1, 'open={' + varName + 'State.isOpen}');
      content = content.replace(openRegex2, 'open={' + varName + 'State.isOpen}');

      const rowRegex = new RegExp('row=\\{' + varName + '\\}', 'g');
      content = content.replace(rowRegex, 'row={' + varName + 'State.value}');

      // Sometimes it's entry={drawer}
      const entryRegex = new RegExp('entry=\\{' + varName + '\\}', 'g');
      content = content.replace(entryRegex, 'entry={' + varName + 'State.value}');

      const onCloseRegex = new RegExp('onClose=\\{\\(\\) => ' + setterName + '\\(null\\)\\}', 'g');
      content = content.replace(onCloseRegex, 'onClose={' + varName + 'State.close}');

      // Handle raw drawer references like {drawer && ...} -> {drawerState.value && ...}
      const rawVarRegex = new RegExp('\\b' + varName + '\\b(?=\\s*(&&|\\?|\\.|\\=))', 'g');
      content = content.replace(rawVarRegex, varName + 'State.value');
    }
  }

  if (hasChanges) {
    // Add import if missing
    if (!content.includes('useDrawerState')) {
      // Find the last import
      const importRegex = /import .* from .*;\\n/g;
      let lastImportIndex = 0;
      let importMatch;
      while ((importMatch = importRegex.exec(content)) !== null) {
        lastImportIndex = importMatch.index + importMatch[0].length;
      }
      
      const importLine = "import { useDrawerState } from '../../../hooks/useDrawerState';\\n";
      content = content.slice(0, lastImportIndex) + importLine + content.slice(lastImportIndex);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith('.jsx')) {
      processFile(full);
    }
  }
}

walk(path.join(__dirname, '../src'));
