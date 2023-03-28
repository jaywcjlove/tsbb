import babelJest from 'babel-jest';

export default babelJest.createTransformer({
  presets: [
    [
      require('@babel/preset-env').default,
      {
        targets: {
          node: 'current',
        },
      },
    ],
    require('@babel/preset-typescript').default,
    require('@babel/preset-react').default,
  ],
  plugins: [
    require('@babel/plugin-transform-runtime').default,
    /**
     * Fix: Cannot use 'import.meta' outside a module
     * https://github.com/facebook/jest/issues/12183#issuecomment-1004320665
     */
    require('babel-plugin-transform-import-meta').default,
    [require('@babel/plugin-proposal-decorators').default, { version: 'legacy' }],
    require('@babel/plugin-proposal-object-rest-spread').default,
  ],
  babelrc: false,
  configFile: false,
});
