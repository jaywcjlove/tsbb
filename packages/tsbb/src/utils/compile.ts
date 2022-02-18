import * as ts from 'typescript';
import FS from 'fs-extra';
import path from 'path';
import { babelCompile } from '../babel/compile';
import { tsCompile } from '../ts/compile';
import { BuildOptions } from '../build';

export async function compile(
  fileNames: string[],
  tsOptions: ts.CompilerOptions = {},
  options: BuildOptions,
): Promise<void> {
  let { cjs = tsOptions.outDir || 'lib', esm = 'esm' } = options || {};
  const outDir = path.resolve(process.cwd(), cjs || tsOptions.outDir);
  cjs = path.relative(ts.sys.getCurrentDirectory(), cjs);
  return new Promise(async (resolve, reject) => {
    try {
      if (cjs || tsOptions.outDir) {
        await FS.remove(outDir);
      }
      if (typeof esm === 'string') {
        await FS.remove(path.resolve(process.cwd(), esm));
      }
      /** copy file & mybe transform .ts file */
      await babelCompile({ ...options, cjs, esm });

      if (tsOptions.noEmit) {
        return resolve();
      }
      tsOptions.noEmit = false;
      await tsCompile(fileNames, tsOptions, { ...options, cjs, esm });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
