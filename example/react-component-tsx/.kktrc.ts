import path from 'path';
import webpack, { Configuration } from 'webpack';
import { LoaderConfOptions } from 'kkt';
import WebpackDevServer from 'webpack-dev-server';
import lessModules from '@kkt/less-modules';
import rawModules from '@kkt/raw-modules';
import scopePluginOptions from '@kkt/scope-plugin-options';
import pkg from './package.json';

export default (conf: Configuration, env: string, options: LoaderConfOptions) => {
  conf = rawModules(conf, env, { ...options });
  conf = scopePluginOptions(conf, env, {
    ...options,
    allowedFiles: [path.resolve(process.cwd(), 'README.md')],
  });
  conf = lessModules(conf, env, options);
  // Get the project version.
  conf.plugins!.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    }),
  );
  conf.output = { ...conf.output, publicPath: './' };
  return conf;
};

/**
 * Modify WebpackDevServer Configuration Example
 */
export const devServer = (config: WebpackDevServer.Configuration) => {
  // Return your customised Webpack Development Server config.
  return config;
};
