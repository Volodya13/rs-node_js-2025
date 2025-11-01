import path from 'path';
import readline from 'readline';
import os from 'os';
import { chdir } from 'process';
import { handleCd, handleLs, handleUp } from './navigation.js';
import {
	handleCat,
	handleAdd,
	handleMkdir,
	handleRename,
	handleMove,
	handleRemove,
	handleCopy
} from './fileOperations.js';
import { printEOL, printCPUs, printHomeDir, printSystemUsername, printArchitecture } from './os.js';
import { handleHash } from './hashCalculation.js';
import { handleCompress } from './compress.js';
import { handleDecompress } from './decompress.js';

const arg = process.argv.find(arg => arg.startsWith('--username='));
const username = arg ? arg.split('=')[1] : null;


chdir(os.homedir());

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(`Welcome to the File Manager, ${username}!`);
printCwd();

rl.on('line', async (line) => {

  const [command, ...args] = line.trim().split(' ');

  try {
    switch (command) {
      case '.exit':
        exitApp();
        return;
      case 'up':
        handleUp();
        break;
      case 'cd':
        if (args.length === 0) throw new Error('Missing path');
        handleCd(args.join(' '));
        break;
      case 'ls':
        handleLs();
        break;
      case 'cat':
        if (args.length === 0) throw new Error('Missing path');
        await handleCat(args.join(' '));
        break;
      case 'add':
        if (args.length === 0) throw new Error('Missing path');
        handleAdd(args.join(' '));
        break;
      case 'mkdir':
        if (args.length === 0) throw new Error('Missing path');
        handleMkdir(args.join(' '));
        break;
      case 'rn':
        if (args.length < 2) throw new Error('Missing arguments');
        handleRename(args[0], args[1]);
        break;
      case 'cp':
        if (args.length < 2) throw new Error('Missing arguments');
        await handleCopy(args[0], args[1]);
        break;
      case 'mv':
        if (args.length < 2) throw new Error('Missing arguments');
        await handleMove(args[0], args[1]);
        break;
      case 'rm':
        if (args.length === 0) throw new Error('Missing path');
        handleRemove(args.join(' '));
        break;
      case 'os':
        if (args.length === 0) throw new Error('Missing OS flag');

        switch (args[0]) {
          case '--EOL':
            printEOL();
            break;
          case '--cpus':
            printCPUs();
            break;
          case '--homedir':
            printHomeDir();
            break;
          case '--username':
            printSystemUsername();
            break;
          case '--architecture':
            printArchitecture();
            break;
          default:
            throw new Error('Invalid OS flag');
        }
        break;
      case 'hash':
        if (args.length === 0) throw new Error('Missing file path');
        await handleHash(args.join(' '));
        break;
      case 'compress':
        if (args.length < 2) throw new Error('Missing arguments');
        await handleCompress(args[0], args[1]);
        break;
      case 'decompress':
        if (args.length < 2) throw new Error('Missing arguments');
        await handleDecompress(args[0], args[1]);
        break;
      default:
        console.log('Invalid input!');
    }
  } catch(error) {
    console.log('Operation failed');
  }

  printCwd();
})

process.on('SIGINT', () => exitApp());

function printCwd() {
  const posixPath = process.cwd().split(path.sep).join(path.posix.sep);
  console.log(`You are currently in ${posixPath}`);
}

function exitApp() {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  rl.close();
  process.exit(0);
}