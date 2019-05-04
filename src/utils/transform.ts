import { transformFile, BabelFileResult, TransformOptions } from '@babel/core';

export interface ITransformResult extends BabelFileResult {
  options: TransformOptions;
}

export default (path: string) => {
  return new Promise<ITransformResult>((resolve, reject) => {
    transformFile(path, {
      presets: ['@babel/preset-env', '@babel/preset-typescript'],
    }, (err, result: ITransformResult) => {
      if (err) {
        reject(err)
      } else {
        resolve(result);
      }
    });
  });
}