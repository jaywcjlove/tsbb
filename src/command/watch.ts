import babel from '../babel';
import { ICompletePathArgs } from '../utils';
import chokidar, { FSWatcher } from 'chokidar';
import { IFileDirStat, getFileStat } from '../utils/getFileDirectory';
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
  console.log(`\nStarting in watch mode.\n`)
  watcher.on('change', async (path: string, stats) => {
    const fileStat = await getFileStat(args.sourceRoot, args.output, path);
    const inc = catchFiles.find((item: IFileDirStat) => item.path === fileStat.path);
    if (!inc) {
      catchFiles.push(fileStat);
    }
    clearTimeout(timer);
    timer = setTimeout(async () => {
      // console.log('args:', args);
      await babel(catchFiles, args);
      catchFiles = []
    }, 800);
  });
}