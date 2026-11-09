import { spawnSync } from 'node:child_process';
import path from 'node:path';

/** Compile an example with the repo CLI. Output dirs are gitignored, so tests cannot assume they already exist. */
export function buildExample(example: string, args: string[]) {
  const root = process.cwd();
  const result = spawnSync(process.execPath, [path.join(root, 'packages/tsbb/lib/cli.js'), ...args], {
    cwd: path.join(root, 'examples', example),
    encoding: 'utf8',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`tsbb ${args.join(' ')} failed in examples/${example}\n${result.stdout}\n${result.stderr}`);
  }
}
