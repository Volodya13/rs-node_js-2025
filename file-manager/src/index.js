import path from 'path';
import readline from 'readline';
import os from 'os';
import { chdir } from 'process';
import { handleCd, handleLs, handleUp } from './navigation.js';
import { handleCat, handleAdd, handleMkdir, handleRename, handleMove, handleRemove } from './fileOperations.js';

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
        handleRename(args[0], args[1]);
        break;
      case 'mv':
        if (args.length < 2) throw new Error('Missing arguments');
        handleMove(args[0], args[1]);
        break;
      case 'rm':
        if (args.length === 0) throw new Error('Missing path');
        handleRemove(args.join(' '));
        break;
      default:
        console.log('Invalid input!');
    }
  } catch(error) {
    console.log('Operation failed');
    throw new Error(error);
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