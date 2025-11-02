import {EOL, homedir, arch, cpus, userInfo} from 'os';

export function printEOL() {
  console.log(JSON.stringify(EOL));
}

export function printCPUs() {
  console.log(`Total CPUs: ${cpus().length}`);
	
  cpus().forEach((cpu, index) => {
    console.log(`CPU ${index + 1}: ${cpu.model}, ${cpu.speed / 1000} GHz`);
  });
}

export function printHomeDir() {
  console.log(`Home directory: ${homedir()}`);
}

export function printSystemUsername() {
  console.log(userInfo().username);
}

export function printArchitecture() {
  console.log(arch());
}