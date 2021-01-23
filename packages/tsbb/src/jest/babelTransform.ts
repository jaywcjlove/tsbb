import babelJest from 'babel-jest';

module.exports = babelJest.createTransformer({
  presets: [
    require.resolve('@babel/preset-env'),
    require.resolve('@babel/preset-typescript'),
    require.resolve('@babel/preset-react'),
  ],
  plugins: [
    require.resolve('@babel/plugin-transform-runtime'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-proposal-object-rest-spread'),
  ],
});
