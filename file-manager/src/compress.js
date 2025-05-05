import { createBrotliCompress } from 'zlib';
import path from 'path';
import fs from 'fs';

export function handleCompress(src, dest) {
  const srcPath = path.isAbsolute(src) ? src : path.resolve(process.cwd(), src);
  const destPath = path.isAbsolute(dest) ? dest : path.resolve(process.cwd(), dest);

  const fileName = path.basename(srcPath);
  const destFile = path.join(destPath, `${fileName}.br`);

  return new Promise((res, rej) => {
    const readStream = fs.createReadStream(srcPath);
    const compressStream = createBrotliCompress();
    const writeStream = fs.createWriteStream(destFile);

    readStream.on('error', () => rej);
    writeStream.on('error', () => rej);
    writeStream.on('finish', () => res);

    readStream
      .pipe(compressStream)
      .pipe(writeStream)
  })
}