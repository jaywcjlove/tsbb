import tsCompile, { findConfigFile, readConfigFile, reportDiagnostic } from '@tsbb/typescript';
import { type BabelCompileOptions } from '@tsbb/babel';
import { babelTransform } from './watcher/babelTransform.js';
import { watcherCopyFiles } from './watcher/copyFiles.js';

export interface CompileOptions extends BabelCompileOptions {
  watch?: boolean;
  bail?: boolean;
  build?: boolean;
  entry?: string[];
  [key: string]: any;
}

export async function compile(options: CompileOptions = {}) {
  if (!options.useBabel) {
    return tsCompile({
      bail: options.bail,
      watch: options.watch,
      onCopyFiles: watcherCopyFiles,
    });
  }
  // ==Use Babel=============================================
  if (!options.entry?.length) {
    const err = [
      '\x1b[31;1m When compiling with\x1b[0m\x1b[33;1m Babel\x1b[0m\x1b[31;1m, you need to specify the compilation file, E.g:\x1b[0m\n',
      '    \x1b[35;1m$\x1b[0m\x1b[36;1m tsbb\x1b[0m build\x1b[33;1m src/*.{jsx,js}\x1b[0m --useBabel',
      '    \x1b[35;1m$\x1b[0m\x1b[36;1m tsbb\x1b[0m build\x1b[33;1m "src/**/*.ts"\x1b[0m --use-babel',
      '    \x1b[35;1m$\x1b[0m\x1b[36;1m tsbb\x1b[0m build\x1b[33;1m src/index.jsx\x1b[0m --use-babel',
      '    \x1b[35;1m$\x1b[0m\x1b[36;1m tsbb\x1b[0m build\x1b[33;1m src/index.jsx\x1b[0m \x1b[33;1m src/main.jsx\x1b[0m --use-babel\n',
      '  \x1b[31;1mThe command you entered:\x1b[0m\n',
      `    \x1b[33;1m$ tsbb ${process.argv.slice(2).join(' ')}\x1b[0m\n`,
      '  \x1b[31;1mThe files you need to compile have been indexed:\x1b[0m\n',
    ];
    (options.entry || []).forEach((fileNames) => err.push(`    \x1b[35;1m${fileNames}\x1b[0m`));
    !options.entry?.length &&
      err.push('    \x1b[33;1mNo files were indexed. Please check your command line arguments.\x1b[0m');
    if (process.platform === 'win32') {
      err.push('\n    Please note that on \x1b[33;1mWindows\x1b[0m platform, double(") quotes should be used to ');
      err.push("    index file parameters instead of single(') quotes.\n");
      err.push('    Correct usage: \x1b[32;1m"src/*.tsx"\x1b[0m');
      err.push("    Incorrect usage: \x1b[31;1m'src/*.tsx'\x1b[0m");
    }
    throw new Error(err.join('\n'));
  }
  const tsConfig = findConfigFile();
  if (tsConfig) {
    const { config, error } = readConfigFile(tsConfig);
    if (error) {
      return reportDiagnostic(error);
    }
    if (config.compilerOptions.outDir && !options.cjs && options.cjs !== false) {
      options.cjs = config.compilerOptions.outDir;
    }
  }
  babelTransform(options);
}
