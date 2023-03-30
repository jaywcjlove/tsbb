import chokidar from 'chokidar';
import path from 'node:path';
import fs from 'fs-extra';
import { Log, CopyFilesOptions } from '@tsbb/typescript';

/**
 * Used to monitor file changes and copy related files, such as: xx.jpg
 * @param entry ['/path/to/main.ts', '/path/to/demo/']
 * @param options
 */
export const watcherCopyFiles = (entry: string[] = [], options: CopyFilesOptions = {}): Promise<void> => {
  const { rootDirsRelative, outputDir, currentDir } = options;
  const log = new Log();
  log.name();
  return new Promise((resolve, reject) => {
    const watcher = chokidar.watch(entry, {
      persistent: true,
    });
    watcher.on('all', async (eventName, filepath, stats) => {
      if (/\.(test|spec)\.(js|jsx|ts|tsx)$/i.test(filepath) || /[/\\]tsconfig\.json$/i.test(filepath)) {
        return;
      }
      if (
        !/\.(m?js|jsx?|m?ts|tsx?|c?js)$/i.test(filepath) &&
        rootDirsRelative &&
        rootDirsRelative.length > 0 &&
        currentDir &&
        outputDir
      ) {
        let outputPath = '';
        if (rootDirsRelative.length > 1) {
          rootDirsRelative.forEach((item) => {
            const itemResolve = path.resolve(currentDir, item);
            if (filepath.indexOf(itemResolve) > -1) {
              outputPath = path.resolve(outputDir, item, path.relative(itemResolve, filepath));
            }
          });
        } else {
          const itemResolve = path.resolve(currentDir, rootDirsRelative[0]);
          if (filepath.indexOf(itemResolve) > -1) {
            outputPath = path.resolve(outputDir, path.relative(itemResolve, filepath));
          }
        }
        if (outputPath && filepath) {
          if (/^(add|change)$/.test(eventName)) {
            fs.ensureDirSync(path.dirname(outputPath));
            fs.copyFile(filepath, outputPath);
            log.icon('🐶').success(`┈┈▶ \x1b[32;1m${path.relative(currentDir, outputPath)}\x1b[0m`);
          }
          if (/^(unlink|unlinkDir)$/.test(eventName)) {
            fs.remove(filepath);
            log.icon('🗑️').success(`┈┈▶ \x1b[32;1m${path.relative(currentDir, outputPath)}\x1b[0m`);
          }
        }
      }
      options.onFilesChange && options.onFilesChange(eventName, filepath, stats);
    });
    watcher.on('error', (error) => {
      options.onError && options.onError(error);
      reject(error);
    });
    watcher.on('ready', () => {
      options.onReady && options.onReady();
      if (!options.isWatch) {
        watcher.close();
      }
      resolve();
    });
  });
};
