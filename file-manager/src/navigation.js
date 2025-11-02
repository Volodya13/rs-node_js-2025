import path from 'path';
import fs from 'fs';

export const handleUp = () => {
  const currentDir = process.cwd();
  const parentDir = path.dirname(currentDir);

  if (parentDir !== currentDir) {
    process.chdir(parentDir);
  }
}

export function handleCd(targetPath) {
  const fullPath = path.isAbsolute(targetPath)
  ? targetPath
  : path.resolve(process.cwd(), targetPath);

  if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory()) {
    process.chdir(fullPath);
  } else {
    throw new Error('Directory not found');
  }
}

export function handleLs() {
  const dirPath = process.cwd();
  const content = fs.readdirSync(dirPath, { withFileTypes: true });

  const dirs = content
    .filter(d => d.isDirectory())
    .map(d => ({ Name: d.name, Type: 'directory' }));
  const files = content
    .filter(f => f.isFile())
    .map(f => ({ Name: f.name, Type: 'file' }));

  const sorted = [...dirs, ...files].sort((a, b) => a.Name.localeCompare(b.Name));

  console.table(sorted);
}