import path from 'node:path';
import fs from 'fs-extra';
import chokidar from 'chokidar';
import { Log } from '@tsbb/typescript';

export interface CopyOption {
  entry?: string[];
  output?: string;
  watch?: boolean;
}

export async function copy(options: CopyOption = {}) {
  const { watch, entry, output } = options;
  if (!output) {
    throw new Error('Please enter the \x1b[33;1moutput\x1b[0m directory');
  }
  const watcher = chokidar.watch(entry || [], {
    persistent: true,
  });
  const log = new Log();
  log.name();
  watcher.on('all', async (eventName, filepath, stats) => {
    const outputPath = path.resolve(process.cwd(), output, filepath);
    fs.ensureDirSync(path.dirname(outputPath));
    fs.copyFile(filepath, path.resolve(process.cwd(), output, filepath));
    log
      .icon('🗞️')
      .success(`Copy \x1b[32;1m${filepath}\x1b[0m ┈┈▶ \x1b[35;1m${path.relative(process.cwd(), outputPath)}\x1b[0m`);
  });
  watcher.on('error', (error) => {
    if (error instanceof Error) {
      log.error(`\n \x1b[33;1m${error.message}\x1b[0m.`);
    } else {
      log.error('An unknown error occurred.');
    }
  });
  watcher.on('ready', () => {
    if (!watch) {
      watcher.close();
    }
  });
}
