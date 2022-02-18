import * as ts from 'typescript';
import { outputFiles, outputLog } from '../utils/output';
import { BuildOptions } from '../build';

export interface TSCompileOptions extends BuildOptions {}
export async function tsCompile(
  fileNames: string[],
  tsOptions: ts.CompilerOptions = {},
  options: TSCompileOptions,
): Promise<void> {
  let { entry, disableBabel, cjs = tsOptions.outDir || 'lib', esm = 'esm', ...other } = options || {};
  return new Promise(async (resolve, reject) => {
    // Create a Program with an in-memory emit
    const createdFiles: Record<string, string> = {};
    const outDirPath = cjs || esm;
    tsOptions = { ...tsOptions, target: tsOptions.target || ts.ScriptTarget.ESNext };
    if (typeof outDirPath === 'string') {
      tsOptions.outDir = outDirPath;
    }
    const host = ts.createCompilerHost(tsOptions, true);
    // ts.getParsedCommandLineOfConfigFile('', tsOptions, host)
    host.readFile = (file) => {
      const result = ts.sys.readFile(file);
      if (!/node_modules/.test(file)) {
        // const output = path.resolve(tsOptions.outDir || cjs, path.relative(entryDir, file));
        // const outputLib = path.relative(process.cwd(), output);
        // if (/.d.ts$/.test(outputLib)) {
        //   createdFiles[outputLib] = result;
        // }
      }
      return result;
    };
    host.writeFile = (fileName: string, contents: string) => {
      return (createdFiles[fileName] = contents);
    };

    const program = ts.createProgram(fileNames, tsOptions, host);

    // Prepare and emit the `d.ts` files
    program.emit();

    await Promise.all(
      Object.keys(createdFiles).map(async (filepath) => {
        try {
          if (disableBabel && !/\.d\.ts$/.test(filepath)) {
            ts.sys.writeFile(filepath, createdFiles[filepath]);
            outputLog(filepath);
          }
          if (/\.d\.ts$/.test(filepath)) {
            if (new RegExp(`${esm}`).test(filepath)) {
              outputFiles(filepath, createdFiles[filepath]);
              if (cjs && typeof esm === 'string') {
                const fileCjs = filepath.replace(esm, cjs);
                outputFiles(fileCjs, createdFiles[filepath]);
              }
            }
            if (new RegExp(`${cjs}`).test(filepath)) {
              outputFiles(filepath, createdFiles[filepath]);
              if (esm && typeof esm === 'string') {
                const fileEsm = filepath.replace(cjs, esm);
                outputFiles(fileEsm, createdFiles[filepath]);
              }
            }
          }
        } catch (error) {
          reject(error);
        }
      }),
    );
    resolve();
  });
}
