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
          [require.resolve('@tsbb/babel-preset-tsbb'), {
            modules: false,
            transformRuntime: { useESModules: true }
          }],
          require.resolve('@babel/preset-react'),
        ]
      },
      cjs: {
        presets: [
          [require.resolve('@tsbb/babel-preset-tsbb'), {
            transformRuntime: {},
          }],
          require.resolve('@babel/preset-react'),
        ],
        plugins: [
          require.resolve('@babel/plugin-transform-runtime')
        ]
      }
    }
  }
  return new Promise<ITransformResult>((resolve: (value?: ITransformResult) => ITransformResult | any, reject) => {
    transformFile(filePath, {
      presets: [
        require.resolve('@tsbb/babel-preset-tsbb')
      ],
      plugins: [
        [require.resolve('@babel/plugin-proposal-decorators'), { 'legacy': true }],
        [require.resolve('@babel/plugin-proposal-class-properties'), { 'loose': true }],
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