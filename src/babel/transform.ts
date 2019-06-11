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

export type ITargets = 'node' | 'react';

export interface IEnv {
  esm?: any;
  cjs?: any;
  [key: string]: any;
}

export default (filePath: string, options: ITransformOptions, targets: ITargets) => {
  let env: IEnv = {}
  if (targets === 'react') {
    env = {
      esm: {
        presets: [
          ["@babel/preset-env", { "modules": false }],
          "@babel/preset-react",
        ],
        plugins: [
          ["@babel/plugin-transform-runtime", { "useESModules": true }]
        ]
      },
      cjs: {
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
        ],
        plugins: [
          "@babel/plugin-transform-runtime"
        ]
      }
    }
  }
  return new Promise<ITransformResult>((resolve: (value?: ITransformResult) => ITransformResult | any, reject) => {
    transformFile(filePath, {
      presets: [
        '@tsbb/babel-preset-tsbb'
      ],
      env: {
        ...env
      },
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