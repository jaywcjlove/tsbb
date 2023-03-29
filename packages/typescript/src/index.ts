import ts from 'typescript';
import path from 'node:path';
import fs from 'fs-extra';
import {
  writeFile,
  getSourceFile,
  reportDiagnostic,
  onWatchStatusChange,
  getRootsFolderName,
  getSourceFilePath,
} from './utils.js';
import { Log } from './log.js';

export * from './utils.js';
export * from './log.js';

export interface CopyFilesOptions {
  isWatch?: boolean;
  /**
   * @example `/path/to/dir/<root>/<lib>`
   */
  outputDir?: string;
  /**
   * @example `/path/to/dir/<root>`
   */
  currentDir?: string;
  /**
   * @example ['src', 'demo']
   */
  rootDirsRelative?: string[];
  onFilesChange?: (
    eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
    path: string,
    stats?: fs.Stats,
  ) => void;
  onError?: (error: any) => void;
  onReady?: () => void;
}

export interface TsCompileOptions {
  watch?: boolean;
  emitDeclarationOnly?: boolean;
  /**
   * @default true
   */
  isCopyFiles?: boolean;
  outDir?: string;
  onWriteFile?: (path: string, data: string, sourceFilePath: string, writeByteOrderMark?: boolean) => void;
  onCopyFiles?: (entry: string[], options: CopyFilesOptions) => void;
}

export const findConfigFile = () => ts.findConfigFile('.', ts.sys.fileExists, 'tsconfig.json');

export default async function compile(options: TsCompileOptions = {}) {
  const { isCopyFiles = true, onWriteFile, onCopyFiles } = options;
  const tsConfigPath = findConfigFile();
  const log = new Log();
  if (!tsConfigPath) {
    log.error(
      `\n \x1b[33;1mYou are trying to compile TypeScript source code using the TypeScript compiler, \n but it cannot find the configuration file named\x1b[0m\x1b[31;1m tsconfig.json\x1b[0m.`,
    );
    return;
  }

  const { config, error } = ts.readConfigFile(path.resolve(tsConfigPath), ts.sys.readFile);
  if (error) {
    return reportDiagnostic(error);
  }

  log.name();

  const parseResult = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(tsConfigPath));
  if (options.emitDeclarationOnly) {
    parseResult.options.emitDeclarationOnly = true;
    delete parseResult.options.noEmit;
  }
  if (!parseResult.options.outDir) {
    parseResult.options.outDir = 'lib';
  } else if (options.outDir) {
    parseResult.options.outDir = options.outDir;
  }
  const compilerOptions = parseResult.options;
  if (parseResult.errors.length) {
    return parseResult.errors.forEach(reportDiagnostic);
  }

  const currentDir = ts.sys.getCurrentDirectory();
  const rootDirsRelative = [...new Set(getRootsFolderName(parseResult.fileNames))];
  const outputDir = path.resolve(currentDir, compilerOptions.outDir || 'lib');
  const rootDirs = [...rootDirsRelative].map((item) => path.resolve(currentDir, item));
  if (options.watch) {
    const createProgram = ts.createEmitAndSemanticDiagnosticsBuilderProgram;
    const system = { ...ts.sys };
    const fileNameData: Record<string, string> = {};
    system.readFile = (fileName, encoding) => {
      if (/^(?!.*\.d\.ts$).*\.(tsx?)+$/.test(fileName)) {
        const sourceFilePath = fileName.indexOf(process.cwd()) > -1 ? path.relative(process.cwd(), fileName) : fileName;
        const finalPath = getSourceFilePath(fileName, rootDirsRelative);
        fileNameData[
          path.relative(currentDir, path.join(outputDir, finalPath)).replace(/\.(m?js|jsx?|m?ts|tsx?|c?js)$/, '.d.ts')
        ] = sourceFilePath;
      }
      return ts.sys.readFile(fileName, encoding);
    };
    system.writeFile = (pathName, data, writeByteOrderMark) => {
      if (options.emitDeclarationOnly && onWriteFile) {
        onWriteFile(pathName, data, fileNameData[pathName], writeByteOrderMark);
      } else {
        writeFile(pathName, data, writeByteOrderMark);
      }
    };
    // Note that there is another overload for `createWatchCompilerHost` that takes
    // a set of root files.
    const host = ts.createWatchCompilerHost(
      parseResult.fileNames,
      compilerOptions,
      system,
      createProgram,
      reportDiagnostic,
    );
    host.onWatchStatusChange = onWatchStatusChange;
    // Start the TypeScript monitor compiler
    ts.createWatchProgram(host);
    if (isCopyFiles && onCopyFiles) {
      await onCopyFiles(rootDirs, { isWatch: options.watch, outputDir, currentDir, rootDirsRelative });
    }
  } else {
    const compilerHost = ts.createCompilerHost(compilerOptions, true);
    const host: ts.CompilerHost = { ...compilerHost, getSourceFile };
    host.writeFile = (fileNamePath, contents, writeByteOrderMark, onError, sourceFiles = [], data) => {
      if (options.emitDeclarationOnly && onWriteFile) {
        const sourceFile = sourceFiles?.find((m) => !!m.fileName);
        if (!sourceFile || !/\.(d.ts)$/i.test(fileNamePath)) return;
        const sourceFilePath =
          sourceFile.fileName.indexOf(process.cwd()) > -1
            ? path.relative(process.cwd(), sourceFile.fileName)
            : sourceFile.fileName;
        onWriteFile(fileNamePath, contents, sourceFilePath, writeByteOrderMark);
        return;
      } else {
        writeFile(fileNamePath, contents, writeByteOrderMark);
      }
    };
    const program = ts.createProgram(parseResult.fileNames, compilerOptions, host);

    const emitResult = program.emit();
    const diagnostics = ts.getPreEmitDiagnostics(program);
    diagnostics.forEach(reportDiagnostic);
    if (isCopyFiles && onCopyFiles) {
      await onCopyFiles(rootDirs, { isWatch: options.watch, outputDir, currentDir, rootDirsRelative });
    }
    if (!options.emitDeclarationOnly && onWriteFile) {
      if (emitResult.emitSkipped) {
        log.icon('\n🚨').error('\x1b[33;1m Compilation failed!!!\x1b[0m\n');
      } else {
        log.icon('\n🎉').error('\x1b[32;1mCompilation successful!\x1b[0m\n');
      }
    }
  }
}
