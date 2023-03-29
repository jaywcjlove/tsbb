import path from 'node:path';
import { getRootsFolderName, __dirname } from '@tsbb/typescript';
import { BabelCompileOptions } from './index.js';

/**
 * Convert suffix
 */
export const convertExtname = (str: string = '') => {
  return str.replace(/\.(m?ts|m?js|jsx?|tsx?|c?js)(?<!\.d\.ts)$/i, '.js');
};

interface OutputPathResult {
  cjs: {
    /** @example "/examples/react-component/lib/demo.js" */
    path: string;
    /** @example "lib/demo.js" */
    fileName: string;
    /** @example "/examples/react-component/lib/demo.d.ts" */
    ts: string;
    /** @example "lib/demo.d.ts" */
    tsFileName: string;
  };
  esm: {
    /** @example "/examples/react-component/esm/demo.js" */
    path: string;
    /** @example "esm/demo.js" */
    fileName: string;
    /** @example "/examples/react-component/esm/demo.d.ts" */
    ts: string;
    /** @example "esm/demo.d.ts" */
    tsFileName: string;
  };
  /** @example "[ 'src' ]" */
  folderList: string[];
  /** @example "'/examples/react-component'" */
  projectDirectory: string;
  /** @example "'src/demo.tsx'" */
  folderFilePath: string;
  /** @example "'demo.tsx'" */
  filePathInProjectDirectory: string;
}

/**
 * @param fileName `/examples/react-component/src/demo.tsx`
 * @param options
 * @returns {OutputPathResult}
 */
export function getOutputPath(fileName: string, options: BabelCompileOptions = {}): OutputPathResult {
  const { entry = [], cjs = 'lib', esm = 'esm' } = options;
  const result = { esm: {}, cjs: {} } as OutputPathResult;
  result.folderList = [...new Set(getRootsFolderName(entry))];
  result.projectDirectory = process.cwd();
  result.folderFilePath = path.relative(result.projectDirectory, fileName);
  result.filePathInProjectDirectory = result.folderFilePath
    .replace(result.folderList.find((m) => result.folderFilePath.startsWith(m)) || '', '')
    .replace(path.sep, '');
  const filePath = result.folderList.length === 1 ? result.filePathInProjectDirectory : result.folderFilePath;
  result.cjs.path = path.resolve(result.projectDirectory, typeof cjs !== 'boolean' ? cjs : '', filePath);
  result.esm.path = path.resolve(result.projectDirectory, typeof esm !== 'boolean' ? esm : '', filePath);
  result.cjs.fileName = convertExtname(path.join(cjs || '', result.filePathInProjectDirectory));
  result.esm.fileName = convertExtname(path.join(esm || '', result.filePathInProjectDirectory));
  result.cjs.path = convertExtname(result.cjs.path);
  result.esm.path = convertExtname(result.esm.path);
  result.esm.ts = result.esm.path.replace(/\.js$/i, '.d.ts');
  result.cjs.ts = result.cjs.path.replace(/\.js$/i, '.d.ts');
  result.esm.tsFileName = result.esm.fileName.replace(/\.js$/i, '.d.ts');
  result.cjs.tsFileName = result.cjs.fileName.replace(/\.js$/i, '.d.ts');
  return result;
}
