import path from 'path';
import { transformFile, BabelFileResult, TransformOptions } from '@babel/core';

export interface ITransformResult extends BabelFileResult {
  options: TransformOptions;
}

export interface ITransformOptions {
  outputPath: string;
  comments: boolean;
  sourceMaps: boolean | 'inline' | 'both' | 'none';
}

export default (filePath: string, options: ITransformOptions) => {
  return new Promise<ITransformResult>((resolve, reject) => {
    transformFile(filePath, {
      presets: ['@babel/preset-env', '@babel/preset-typescript'],
      plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread'
      ],
      // comments: process.env.NODE_ENV === 'development' ? false : true,
      // comments: false,
      sourceMaps: options.sourceMaps === 'none' ? false : options.sourceMaps,
      sourceFileName: path.relative(path.dirname(options.outputPath), filePath),
    }, (err, result: ITransformResult) => {
      if (err) {
        reject(err)
      } else {
        resolve(result);
      }
    });
  });
}