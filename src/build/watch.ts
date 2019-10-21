import chokidar, { FSWatcher } from 'chokidar';
import FS from 'fs-extra';
import { Argv } from 'yargs';
import { IFileDirStat, getFileStat } from '../utils/getFileDirectory';
import { clearScreenConsole } from '../utils/clearConsole';
import { completePath } from '../utils';
import { publicOptions, helpOption } from '../command/options';
import babel from '../babel';
import * as build from './';
import { IBuildArgs } from './';

export const command = 'watch [options]';
export const describe = 'Recompile files on changes.';

export function builder(yarg: Argv) {
  return yarg.option({
    ...helpOption,
    ...publicOptions,
    'timer': {
      alias: 't',
      describe: 'Compile interval.',
      type: 'number',
      default: 300,
    },
  })
  .example('$ tsbb watch ', 'Rebuilds on any change.')
}

export async function handler(args: IBuildArgs) {
  args = completePath(args) as IBuildArgs;
  if (args.emptyDir && args.output) {
    await FS.emptyDir(args.output);
  }
  await build.handler(args);
  // Initialize watcher.
  // Watch the target directory for changes and trigger reload
  const watcher: FSWatcher = chokidar.watch(args.sourceRoot, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });
  let timer: NodeJS.Timeout = null;
  let catchFiles: IFileDirStat[] = [];
  clearScreenConsole('\nStarting in watch mode.')
  watcher.on('change', async (path: string, stats) => {
    clearScreenConsole()
    const fileStat = await getFileStat(args.sourceRoot, args.output, path);
    const inc = catchFiles.find((item: IFileDirStat) => item.path === fileStat.path);
    if (!inc) {
      catchFiles.push(fileStat);
    }
    clearTimeout(timer);
    timer = setTimeout(async () => {
      await babel(catchFiles, args);
      catchFiles = []
    }, args.timer);
  });
}