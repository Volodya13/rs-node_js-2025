import fs from 'fs';
import path from 'path';

export function handleCat(filePath) {

	const absolutePath = path.isAbsolute(filePath)
	  ? filePath
	  : path.resolve(process.cwd(), filePath);
	
  return new Promise((res, rej) => {
    const stream = fs.createReadStream(absolutePath, {
      encoding: 'utf-8'
    });

    stream.on('error', () => {
      rej(new Error('Operation failed'));
    });

    stream.pipe(process.stdout);

    stream.on('close', () => {
      res();
    });
  })
}

export function handleAdd(fileName) {
  const filePath = path.resolve(process.cwd(), fileName);

  if (fs.existsSync(filePath)) {
    throw new Error('File already exists');
  }

  fs.writeFileSync(filePath, '', 'utf-8');
}

export function handleMkdir(dirName) {
  const dirPath = path.resolve(process.cwd(), dirName);

  if (fs.existsSync(dirPath)) {
    throw new Error('Directory already exists');
  }

  fs.mkdirSync(dirPath, { recursive: true });
}

export function handleRename(oldPath, newFileName) {
  const oldFullPathName = path.isAbsolute(oldPath)
    ? oldPath
    : path.resolve(process.cwd(), oldPath);

    const dir = path.dirname(oldFullPathName);
    const newFullPathName = path.join(dir, newFileName);

    if (!fs.existsSync(oldFullPathName) || fs.existsSync(newFullPathName)) {
      throw new Error('Invalid paths');
    }

  fs.renameSync(oldFullPathName, newFullPathName);
}

export function handleCopy(src, dest) {
  const srcPath = path.isAbsolute(src)
    ? src
    : path.resolve(process.cwd(), src);

  const destPath = path.isAbsolute(dest)
    ? dest
    : path.resolve(process.cwd(), dest);

  if (!fs.existsSync(srcPath) || !fs.existsSync(destPath)) {
    throw new Error('Invalid paths');
  }

  const fileName = path.basename(srcPath);
  const destDirPath = path.join(destPath, fileName);

  return new Promise((res, rej) => {
    const readStream = fs.createReadStream(srcPath);
    const writeStream = fs.createWriteStream(destDirPath);

    readStream.on('error', (error) => rej(error));
    writeStream.on('error', (error) => rej(error));
    writeStream.on('finish', res);

    readStream.pipe(writeStream);
  });
}

export async function handleMove(src, dest) {
  await handleCopy(src, dest);
  const srcPath = path.isAbsolute(src)
    ? src
    : path.resolve(process.cwd(), src);

    fs.unlinkSync(srcPath);
}

export function handleRemove(filePath) {
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error('File not found');
  }

  fs.unlinkSync(fullPath);
}
