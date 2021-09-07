import path from 'path';
import Jest from '@jest/types';

interface IJestConfig extends Jest.Config.InitialOptions {
  [key: string]: any;
}

export default (resolve: Function, rootDir: string) => {
  const conf: IJestConfig = {
    rootDir: rootDir,
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      '<rootDir>/test/**/*.{js,jsx,ts,tsx}',
      '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    ],
    testEnvironment: 'jsdom',
    testRunner: require.resolve('jest-circus/runner'),
    transform: {
      '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': resolve('lib/jest/babelTransform.js'),
      '^.+\\.css$': resolve('lib/jest/cssTransform.js'),
      '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': resolve('lib/jest/fileTransform.js'),
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
      '^.+\\.module\\.(css|less|styl|sass|scss)$',
    ],
    moduleNameMapper: {
      '^react-native$': 'react-native-web',
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
    watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
    resetMocks: true,
  };

  const overrides: IJestConfig = Object.assign({}, require(path.join(rootDir, 'package.json')).jest);

  if (overrides) {
    const supportedKeys: string[] = [
      'clearMocks',
      'collectCoverageFrom',
      'coveragePathIgnorePatterns',
      'coverageReporters',
      'coverageThreshold',
      'displayName',
      'extraGlobals',
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
    ];
    supportedKeys.forEach((key: string) => {
      if (overrides.hasOwnProperty(key)) {
        if (Array.isArray(conf[key]) || typeof conf[key] !== 'object') {
          // for arrays or primitive types, directly override the config key
          conf[key] = overrides[key];
        } else {
          // for object types, extend gracefully
          conf[key] = Object.assign({}, conf[key], overrides[key]);
        }
        delete overrides[key];
      }
    });
    const unsupportedKeys = Object.keys(overrides);
    if (unsupportedKeys.length) {
      console.error(
        '\x1b[1;31mOut of the box, TSBB only supports overriding \x1b[0m' +
          '\x1b[1;31mthese Jest options:\x1b[0m\n\n' +
          supportedKeys.map((key) => '  \u2022 ' + key).join('\n') +
          '.\n\n' +
          '\x1b[1;31mThese options in your package.json Jest configuration \x1b[0m' +
          '\x1b[1;31mare not currently supported by TSBB App:\x1b[0m\n\n' +
          unsupportedKeys.map((key) => '  \u2022 ' + key).join('\n'),
      );
      process.exit(1);
    }
  }
  return conf;
};
