import babelJest from 'babel-jest';

module.exports = babelJest.createTransformer({
  presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread'
  ],
});