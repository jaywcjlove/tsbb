import execa from 'execa';
import { executeCommand } from './executeCommand';

export default async (targetDir: string, command: string) => {
  const args = [];
  args.push('install');
  await executeCommand(command, args, targetDir);
}