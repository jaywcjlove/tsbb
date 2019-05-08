import chokidar, { FSWatcher } from 'chokidar';
import { ICompletePathArgs } from '../utils';
import { IFileDirStat, getFileStat } from '../utils/getFileDirectory';
import { clearScreenConsole } from '../utils/clearConsole';
import babel from '../babel';
import build from './build';

export default async (args: ICompletePathArgs) => {
  await build(args);
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