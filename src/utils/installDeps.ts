import execa from 'execa';

function executeCommand(command: string, args: string[], targetDir: string) {
  return new Promise((resolve, reject) => {
    const child = execa(command, args, {
      cwd: targetDir,
      stdio: ['inherit', 'inherit', command === 'yarn' ? 'pipe' : 'inherit'],
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`command failed: ${command} ${args.join(' ')}`));
        return;
      }
      resolve();
    });
  });
}

export default async (targetDir: string, command: string) => {
  const args = [];
  args.push('install');
  await executeCommand(command, args, targetDir);
}