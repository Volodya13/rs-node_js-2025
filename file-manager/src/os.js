import os from 'os';

export function printEOL() {
  console.log(JSON.stringify(os.EOL));
}

export function printCPUs() {
  const cpus = os.cpus();
  console.log(`Total CPUs: ${cpus.length}`);
  cpus.forEach((cpu, index) => {
    console.log(`CPU ${index + 1}: ${cpu.model}, ${cpu.speed / 1000} GHz`);
  });
}

export function printHomeDir() {
  console.log(os.homedir());
}

export function printSystemUsername() {
  console.log(os.userInfo().username);
}

export function printArchitecture() {
  console.log(os.arch());
}