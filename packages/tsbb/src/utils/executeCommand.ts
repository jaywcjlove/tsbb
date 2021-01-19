import execa from 'execa';

export async function executeCommand(command: string, args: string[], targetDir: string) {
  try {
    const results = await execa(command, [...args], {
      cwd: targetDir,
      stdio: ['inherit', 'inherit', command === 'yarn' ? 'pipe' : 'inherit'],
    });
    return results;
  } catch (error) {
    new Error(`command failed: ${error.message || ''}`);
  }
}
