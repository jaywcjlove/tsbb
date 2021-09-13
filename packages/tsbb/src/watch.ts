import ts from 'typescript';
import { watchCompile } from './utils/watchCompile';
import { BuildOptions } from './build';

export interface WatchOptions extends BuildOptions {}
export async function watch(options: WatchOptions, compilerOptions?: ts.CompilerOptions) {
  try {
    await watchCompile(options.fileNames, compilerOptions, options);
  } catch (error) {
    console.error('ERROR', error);
    process.exit(1);
  }
}
