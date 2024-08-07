import babelCompile, { getOutputPath } from '@tsbb/babel';
import tsCompile, { findConfigFile, Log, getExt, getRootsFolderName, type CopyFilesOptions } from '@tsbb/typescript';
import path from 'node:path';
import ts from 'typescript';
import fs from 'fs-extra';
import { watcherCopyFiles } from '../watcher/copyFiles.js';
import { type CompileOptions } from '../compile.js';

export function babelTransform(options: CompileOptions = {}) {
  const { cjs = 'lib', esm = 'esm' } = options;
  const rootDirsRelative = [...new Set(getRootsFolderName(options.entry))];
  const entry = rootDirsRelative.map((item) => path.resolve(item));
  const onFilesChange: CopyFilesOptions['onFilesChange'] = (eventName, filepath, stats) => {
    const log = new Log().name();
    const dt = getOutputPath(filepath, options);
    if (/\.(m?ts|m?js|jsx?|tsx?|c?js)(?<!\.d\.ts)$/i.test(filepath)) {
      if (/^(add|change)$/.test(eventName)) {
        babelCompile(filepath, { ...options });
      }
    } else if (/^(add|change)$/.test(eventName)) {
      if (typeof cjs !== 'boolean') {
        fs.ensureDirSync(path.dirname(dt.cjs.path));
        fs.copyFile(filepath, dt.cjs.path);
        log
          .icon('🐶')
          .success(
            `${getExt(filepath)}┈┈▶ \x1b[32;1m${dt.folderFilePath}\x1b[0m => \x1b[34;1m${dt.cjs.tsFileName}\x1b[0m`,
          );
      }
      if (typeof esm !== 'boolean') {
        fs.ensureDirSync(path.dirname(dt.esm.path));
        fs.copyFile(filepath, dt.esm.path);
        log
          .icon('🐶')
          .success(
            `${getExt(filepath)}┈┈▶ \x1b[32;1m${dt.folderFilePath}\x1b[0m => \x1b[34;1m${dt.esm.tsFileName}\x1b[0m`,
          );
      }
    }
    if (/^(unlink|unlinkDir)$/.test(eventName)) {
      fs.remove(dt.cjs.path);
      fs.remove(dt.esm.path);
      log.icon('🗑️').success(`┈┈▶ \x1b[32;1m${path.relative(process.cwd(), filepath)}\x1b[0m`);
    }
  };
  const onReady = () => {
    const log = new Log();
    if (!options.watch) {
      // log.name().icon('\n🎉').error('\x1b[32;1mCompilation successful!\x1b[0m\n');
    } else {
      log.name().icon('\n🎉').error('\x1b[32;1mWatching for file changes.\x1b[0m\n');
    }
  };
  const onWriteFile = (
    fileNamePath: string,
    contents: string,
    sourceFilePath: string,
    writeByteOrderMark?: boolean,
  ) => {
    const dt = getOutputPath(path.resolve(process.cwd(), sourceFilePath), options);
    const log = new Log();
    log.name();
    if (typeof cjs === 'string') {
      writeFile(dt.cjs.ts, dt.cjs.tsFileName, sourceFilePath, contents, writeByteOrderMark);
    }
    if (typeof esm === 'string') {
      writeFile(dt.esm.ts, dt.esm.tsFileName, sourceFilePath, contents, writeByteOrderMark);
    }
  };

  const tsConfigPath = findConfigFile();
  if (tsConfigPath) {
    tsCompile({
      bail: options.bail,
      emitDeclarationOnly: true,
      watch: options.watch,
      isCopyFiles: false,
      outDir: typeof cjs === 'string' ? cjs : undefined,
      onWriteFile,
    });
  }
  watcherCopyFiles(entry, { isWatch: options.watch, onFilesChange, onReady, rootDirsRelative });
}

const writeFile = (to: string, target: string, fileName: string, content: string, writeByteOrderMark?: boolean) => {
  const log = new Log();
  log.name();
  ts.sys.writeFile(to, content, writeByteOrderMark);
  log.icon('🐳').success(`${getExt(fileName)}┈┈▶ \x1b[32;1m${fileName}\x1b[0m => \x1b[34;1m${target}\x1b[0m`);
};
