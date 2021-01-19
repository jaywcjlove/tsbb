import { executeCommand } from './executeCommand';

export async function installDeps(targetDir: string, command: string) {
  const args = [];
  args.push('install');
  await executeCommand(command, args, targetDir);
};
