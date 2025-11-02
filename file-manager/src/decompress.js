import { createBrotliDecompress } from 'zlib';
import path from 'path';
import fs from 'fs';

export function handleDecompress(src, dest) {
  const srcPath = path.isAbsolute(src) ? src : path.resolve(process.cwd(), src);
  const destPath = path.isAbsolute(dest) ? dest : path.resolve(process.cwd(), dest);

  const fileName = path.basename(srcPath, '.br');
  const destFile = path.join(destPath, fileName);

  return new Promise((res, rej) => {
    const readStream = fs.createReadStream(srcPath);
    const decompressStream = createBrotliDecompress();
    const writeStream = fs.createWriteStream(destFile);

    readStream.on('error', (error) => rej(error));
    writeStream.on('error', (error) => rej(error));
    writeStream.on('finish', res);

    readStream
      .pipe(decompressStream)
      .pipe(writeStream);
  });
}