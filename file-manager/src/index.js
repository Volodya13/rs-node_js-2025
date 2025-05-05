import path from 'path';
import readline from 'readline';
import os from 'os';
import { chdir } from 'process';

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

  if (line.trim() === '.exit') {
    exitApp();
  } else {
    console.log('Invalid input');
    printCwd();
  }
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