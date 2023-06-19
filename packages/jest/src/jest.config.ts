import path from 'path';
import Jest from 'jest';
import fs from 'fs-extra';

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

export default async function jestConfig(resolve: Function, rootDir: string): Promise<Jest.Config> {
  const conf: Jest.Config = {
    // displayName: 'client',
    // preset: 'ts-jest',
    roots: ['<rootDir>'],
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      '<rootDir>/test/**/*.{js,jsx,ts,tsx}',
      '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    ],
    // testEnvironment: 'jsdom',
    testEnvironment: 'jest-environment-jsdom',
    // testEnvironment: resolve('node_modules/jest-environment-jsdom/build/index.js'),
    // testEnvironmentOptions: {
    //   url: 'http://localhost', // Your testing URL
    //   userAgent: 'Custom User Agent', // Your custom user agent
    //   resources: 'usable', // Allow document to wait for resources (e.g. images, fonts)
    //   runScripts: 'dangerously', // Allow running scripts
    //   // More options can be added as needed
    //   // html: `<!DOCTYPE html><html><head></head><body>hello</body></html>`,
    //   // url: 'https://jestjs.io/',
    //   // userAgent: 'Agent/007',
    // },
    // testEnvironment: 'jest-environment-node',
    transform: {
      // '^.+\\.ts$': 'ts-jest',
      // '^.+\\.js|jsx|mjs|cjs|ts|tsx$': resolve('node_modules/babel-jest'),
      // '^.+\\.ts$': "<rootDir>../../packages/jest/node_modules/ts-jest",
      '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': resolve('lib/transform/babel.js'),
      '^.+\\.(css)$': resolve('lib/transform/css.js'),
      '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': resolve('lib/transform/file.js'),
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
      '^.+\\.module\\.(css|less|styl|sass|scss)$',
    ],
    moduleNameMapper: {
      '^react-native$': 'react-native-web',
      '^.+\\.module\\.(css|less|styl|sass|scss)$': 'identity-obj-proxy',
    },
    moduleFileExtensions: [...moduleFileExtensions, 'node'].filter((ext) => !ext.includes('mjs')),
    watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
    resetMocks: true,
    coverageReporters: ['lcov', 'json-summary'],
  };
  if (rootDir) {
    conf.rootDir = rootDir;
  }

  const pkgJest = fs.readJSONSync(path.join(rootDir, 'package.json')).jest;
  const overrides: Jest.Config = Object.assign({}, pkgJest);

  if (overrides) {
    const supportedKeys: (keyof Jest.Config)[] = [
      /**
       * https://www.npmjs.com/package/jest-node-exports-resolver
       * This is heavily discussed in the following [issue #9771](https://github.com/facebook/jest/issues/9771).
       * Several alternatives proposed, such as
       * [using enhanced-resolve](https://github.com/facebook/jest/issues/9771#issuecomment-841624042),
       * [writing own resolver based on firebase-jest-testing resolver](https://github.com/facebook/jest/issues/9771#issuecomment-677759334),
       * [using custom resolver written for esfx](https://github.com/facebook/jest/issues/9771#issuecomment-838867473).
       */
      'resolver',

      'clearMocks',
      'collectCoverageFrom',
      'coveragePathIgnorePatterns',
      'coverageReporters',
      'coverageThreshold',
      'displayName',
      'globalSetup',
      'globalTeardown',
      'moduleNameMapper',
      'resetMocks',
      'resetModules',
      'restoreMocks',
      'snapshotSerializers',
      'testMatch',
      'transform',
      'transformIgnorePatterns',
      'watchPathIgnorePatterns',

      'testPathIgnorePatterns',
    ];
    for (const key of supportedKeys) {
      if (overrides.hasOwnProperty(key)) {
        if (Array.isArray(conf[key]) || typeof conf[key] !== 'object') {
          // @ts-ignore
          conf[key] = overrides[key];
        } else {
          conf[key] = Object.assign({}, conf[key], overrides[key]);
        }
        delete overrides[key];
      }
    }
    const unsupportedKeys = Object.keys(overrides);
    if (unsupportedKeys.length) {
      const isOverridingSetupFile = unsupportedKeys.indexOf('setupFilesAfterEnv') > -1;
      if (isOverridingSetupFile) {
        console.error(
          '\x1b[0;31mWe detected ' +
            '\x1b[4;31msetupFilesAfterEnv \x1b[0;31m' +
            'in your package.json.\n\n' +
            'Remove it from Jest configuration, and put the initialization code in ' +
            '\x1b[4;31msrc/setupTests.js\x1b[0;31m' +
            '.\nThis file will be loaded automatically.\x1b[0m\n',
        );
      } else {
        console.error(
          '\x1b[1;31mOut of the box, TSBB only supports overriding \x1b[0m' +
            '\x1b[1;31mthese Jest options:\x1b[0m\n\n' +
            supportedKeys.map((key) => '  \u2022 ' + key).join('\n') +
            '.\n\n' +
            '\x1b[1;31mThese options in your package.json Jest configuration \x1b[0m' +
            '\x1b[1;31mare not currently supported by TSBB App:\x1b[0m\n\n' +
            unsupportedKeys.map((key) => '  \u2022 ' + key).join('\n'),
        );
      }
      process.exit(1);
    }
  }
  return conf;
}
