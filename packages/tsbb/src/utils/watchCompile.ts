import path from 'path';
import chokidar from 'chokidar';
import * as ts from 'typescript';
import { WatchOptions } from '../watch';
import { compile } from './compile';
import { transform } from '../babel';
import { outputFiles } from './output';

export interface WatchCompileOptions extends WatchOptions {}
export async function watchCompile(
  rootFileNames: string[],
  tsOptions: ts.CompilerOptions,
  options: WatchCompileOptions,
) {
  let { entry, cjs = tsOptions.outDir || 'lib', esm = 'esm', ...other } = options || {};
  const entryDir = path.dirname(entry);
  cjs = path.relative(ts.sys.getCurrentDirectory(), cjs);
  const compilerOptions: ts.CompilerOptions = {
    ...tsOptions,
    outDir: cjs || esm,
  };

  await compile([options.entry], tsOptions, options);

  const watcher = chokidar.watch(path.dirname(entry), {
    persistent: true,
  });

  watcher.on('change', async (filepath) => {
    if (esm) {
      const output = filepath.replace(entryDir, esm);
      if (/\.(ts|tsx|js|jsx)$/.test(filepath) && !/\.(d.ts|.(test|spec).(ts|tsx|js|jsx))$/.test(filepath)) {
        transform(filepath, { entryDir, esm, ...other });
      } else if (!/\.(.(test|spec).(ts|tsx|js|jsx))$/.test(filepath)) {
        const result = ts.sys.readFile(filepath);
        outputFiles(output, result);
      }
    }
    if (cjs) {
      const output = filepath.replace(entryDir, cjs);
      if (/\.(ts|tsx|js|jsx)$/.test(filepath) && !/\.(d.ts|.(test|spec).(ts|tsx|js|jsx))$/.test(filepath)) {
        transform(filepath, { entryDir, cjs, ...other });
      } else if (!/\.(.(test|spec).(ts|tsx|js|jsx))$/.test(filepath)) {
        const result = ts.sys.readFile(filepath);
        outputFiles(output, result);
      }
    }
  });
  if (tsOptions.noEmit) {
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
        if (cjs) {
          const fileCjs = file.replace(esm, cjs);
          outputFiles(fileCjs, content);
        }
      }
      if (new RegExp(`${cjs}`).test(file)) {
        outputFiles(file, content);
        if (esm) {
          const fileEsm = file.replace(cjs, esm);
          outputFiles(fileEsm, content);
        }
      }
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
