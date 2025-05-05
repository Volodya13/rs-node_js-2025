import { createHash } from 'crypto';
import path from 'path';
import fs from 'fs';

export function handleHash(filePath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    const hash = createHash('sha256');
    const stream = fs.createReadStream(fullPath);

    stream.on('error', () => reject(new Error('Operation failed')));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => {
      console.log(hash.digest('hex'));
      resolve();
    });
  });
}
