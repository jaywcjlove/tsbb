import { transformFile, type BabelFileResult, type TransformOptions, loadPartialConfig } from '@babel/core';

export interface TransformBabelFileResult extends BabelFileResult {
  options: TransformOptions;
}

export function transform(fileName: string, ops: TransformOptions = {}): Promise<BabelFileResult | null> {
  const babelOptions = loadPartialConfig({ ...ops, cwd: process.cwd() });
  return new Promise((resolve, reject) => {
    transformFile(fileName, { ...babelOptions?.options, babelrc: true }, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}
