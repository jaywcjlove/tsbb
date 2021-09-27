import path from 'path';
import chokidar from 'chokidar';
import { isMatch } from 'micromatch';
import * as ts from 'typescript';
import { WatchOptions } from '../watch';
import { compile } from './compile';
import { transform } from '../babel';
import { outputFiles, outputLog } from './output';

export interface WatchCompileOptions extends WatchOptions {}
export async function watchCompile(
  rootFileNames: string[],
  tsOptions: ts.CompilerOptions,
  options: WatchCompileOptions,
) {
  let { entry, cjs = tsOptions.outDir || 'lib', esm = 'esm', disableBabel, ...other } = options || {};
  const entryDir = path.dirname(entry);
  cjs = path.relative(ts.sys.getCurrentDirectory(), cjs);

  const compilerOptions: ts.CompilerOptions = { ...tsOptions };
  const outDirPath = cjs || esm;
  if (typeof outDirPath === 'string') {
    tsOptions.outDir = outDirPath;
  }

  if (!disableBabel) {
    await compile([options.entry], tsOptions, options);
  }

  const watcher = chokidar.watch(path.dirname(entry), {
    persistent: true,
  });
  watcher.on('change', async (filepath) => {
    if (typeof esm === 'string') {
      const output = filepath.replace(entryDir, esm);
      if (
        !disableBabel &&
        isMatch(output, ['**/*.[jt]s?(x)']) &&
        !isMatch(output, ['**/?(*.)+(spec|test).[jt]s?(x)', '**/*.d.ts', '**/tsconfig.json'])
      ) {
        transform(filepath, { entryDir, esm, ...other });
      } else if (!isMatch(output, ['**/?(*.)+(spec|test).[jt]s?(x)', '**/tsconfig.json', '**/*.d.ts'])) {
        const result = ts.sys.readFile(filepath);
        outputFiles(output, result);
      }
    }
    if (typeof cjs === 'string') {
      const output = filepath.replace(entryDir, cjs);
      if (
        !disableBabel &&
        isMatch(output, ['**/*.[jt]s?(x)']) &&
        !isMatch(output, ['**/?(*.)+(spec|test).[jt]s?(x)', '**/*.d.ts'])
      ) {
        transform(filepath, { entryDir, cjs, ...other });
      } else if (!isMatch(output, ['**/?(*.)+(spec|test).[jt]s?(x)', '**/tsconfig.json', '**/*.d.ts'])) {
        const result = ts.sys.readFile(filepath);
        outputFiles(output, result);
      }
    }
  });
  if ((tsOptions.noEmit && disableBabel) || (tsOptions.noEmit && !disableBabel)) {
    return;
  }
  compilerOptions.noEmit = false;
  const sysOverride: ts.System = {} as ts.System;
  for (let key in ts.sys) {
    (sysOverride as any)[key] = (ts.sys as any)[key];
  }
  sysOverride.writeFile = (file, content) => {
    if (/\.d\.ts$/.test(file)) {
      if (new RegExp(`${esm}`).test(file)) {
        outputFiles(file, content);
        if (cjs && typeof esm === 'string') {
          const fileCjs = file.replace(esm, cjs);
          outputFiles(fileCjs, content);
        }
      }
      if (new RegExp(`${cjs}`).test(file)) {
        outputFiles(file, content);
        if (esm && typeof esm === 'string') {
          const fileEsm = file.replace(cjs, esm);
          outputFiles(fileEsm, content);
        }
      }
    } else if (disableBabel) {
      outputLog(file);
      ts.sys.writeFile(file, content);
    }
  };

  const createProgram = ts.createEmitAndSemanticDiagnosticsBuilderProgram;

  // Note that there is another overload for `createWatchCompilerHost` that takes
  // a set of root files.
  const host = ts.createWatchCompilerHost(rootFileNames, compilerOptions, sysOverride, createProgram, reportDiagnostic);

  host.onWatchStatusChange = (
    diagnostic: ts.Diagnostic,
    newLine: string,
    options: ts.CompilerOptions,
    errorCount?: number,
  ) => {
    if (errorCount) {
      console.error(
        ` \x1b[31;1m TS${diagnostic.code} \x1b[0m Found \x1b[31;1m${errorCount}\x1b[0m error. Watching for file changes.`,
      );
    }
  };

  // `createWatchProgram` creates an initial program, watches files, and updates
  // the program over time.
  ts.createWatchProgram(host);
}

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: (pathName) => pathName,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
};

function reportDiagnostic(diagnostic: ts.Diagnostic) {
  console.error(
    'ERROR:',
    diagnostic.code,
    ':',
    ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine()),
  );
}
