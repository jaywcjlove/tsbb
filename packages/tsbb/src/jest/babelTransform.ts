import babelJest from 'babel-jest';

module.exports = babelJest.createTransformer({
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
    // require('babel-plugin-add-module-exports').default,
    // require('@babel/plugin-proposal-object-rest-spread').default,
    // require('babel-plugin-transform-typescript-metadata').default,
    // [require('@babel/plugin-proposal-decorators').default],
    // [require('@babel/plugin-transform-classes').default],
    // // ["@babel/plugin-proposal-private-property-in-object", { "loose": false }],
    // [require('@babel/plugin-proposal-private-property-in-object').default, {
    //   loose: false,
    // }],
    // [require('@babel/plugin-proposal-class-properties').default, {
    //   loose: false,
    // }]
  ],
});
