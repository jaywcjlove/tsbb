import * as ts from 'typescript';
import FS from 'fs-extra';
import path from 'path';
import { transform } from './';
import { isMatch } from 'micromatch';
import recursiveReaddirFiles from 'recursive-readdir-files';
import { BuildOptions } from '../build';
import { copyFiles } from '../utils/output';

export interface BabelCompileOptions extends BuildOptions {}
export function babelCompile(options: BuildOptions): Promise<void> {
  let { entry, disableBabel, cjs = 'lib', esm = 'esm', ...other } = options || {};
  const entryDir = path.dirname(entry);
  cjs = path.relative(ts.sys.getCurrentDirectory(), cjs);

  return new Promise(async (resolve, reject) => {
    try {
      const dirToFiles = await recursiveReaddirFiles(path.dirname(entry), {
        exclude: /(tsconfig.json|\.d\.ts|\.(test|spec)\.(ts|tsx|js|jsx))$/,
      });
      await Promise.all(
        dirToFiles.map(async (item) => {
          if (cjs) {
            const cjsPath = item.path.replace(entryDir, cjs);
            if (
              !disableBabel &&
              isMatch(item.path, ['**/*.[jt]s?(x)']) &&
              !isMatch(item.path, ['**/?(*.)+(spec|test).[jt]s?(x)'])
            ) {
              transform(item.path, { entryDir, cjs, ...other });
            } else if (!isMatch(item.path, ['**/*.[jt]s?(x)'])) {
              copyFiles(item.path, cjsPath);
            }
          }
          if (typeof esm === 'string') {
            const esmPath = item.path.replace(entryDir, esm);
            if (
              !disableBabel &&
              isMatch(item.path, ['**/*.[jt]s?(x)']) &&
              !isMatch(item.path, ['**/?(*.)+(spec|test).[jt]s?(x)'])
            ) {
              transform(item.path, { entryDir, esm, ...other });
            } else if (!isMatch(item.path, ['**/*.[jt]s?(x)'])) {
              copyFiles(item.path, esmPath);
            }
          }
        }),
      );
      resolve();
    } catch (error) {
      if (error instanceof Error) {
        console.log(`\x1b[31;1m Err:Babel:Transform: ${error.message} \x1b[0m`);
      }
      reject(error);
    }
  });
}
