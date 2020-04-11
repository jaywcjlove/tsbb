import path from 'path';
import { OptionConf } from 'kkt';
import webpack from 'webpack';

type Webpack = typeof webpack;

export const loaderOneOf = [
  require.resolve('@kkt/loader-less')
];

export default (conf: webpack.Configuration, opts: OptionConf, webpack: Webpack) => {
  const pkg = require(path.resolve(process.cwd(), 'package.json'));
  // conf.module.rules.map((item) => {
  //   if (item.oneOf) {
  //     item.oneOf.unshift({
  //       test: /\.md$/,
  //       use: require.resolve('raw-loader'),
  //     });
  //   }
  //   return item;
  // });
  // 获取版本
  conf.plugins!.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    })
  );

  return conf;
}

