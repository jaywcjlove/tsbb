import babelJest from 'babel-jest';

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

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
    [
      require('@babel/preset-react').default,
      {
        // Adds component stack to warning messages
        // Adds __self attribute to JSX which React will use for some warnings
        development: true,
        // Will use the native built-in instead of trying to polyfill
        // behavior for any plugins that require one.
        ...(hasJsxRuntime ? {} : { useBuiltIns: true }),
        runtime: hasJsxRuntime ? 'automatic' : 'classic',
      },
    ],
  ],
  plugins: [
    require('@babel/plugin-transform-runtime').default,
    /**
     * Fix: Cannot use 'import.meta' outside a module
     * https://github.com/facebook/jest/issues/12183#issuecomment-1004320665
     */
    require('babel-plugin-transform-import-meta').default,
    [require('@babel/plugin-proposal-decorators').default, { legacy: true }],
    [require('babel-plugin-parameter-decorator')],
    [require('@babel/plugin-proposal-class-properties').default, { loose: true }],
    [
      require('@babel/plugin-proposal-private-methods').default,
      {
        loose: true,
      },
    ],
    [
      require('@babel/plugin-proposal-private-property-in-object').default,
      {
        loose: true,
      },
    ],
    require('@babel/plugin-proposal-object-rest-spread').default,
    // Adds Numeric Separators
    require('@babel/plugin-proposal-numeric-separator').default,
  ],
  babelrc: false,
  configFile: false,
});
