import path from 'path';
import Jest from '@jest/types';

interface IJestConfig extends Jest.Config.InitialOptions {
  [key: string]: any;
}

export default (resolve: Function, rootDir: string) => {
  const conf: IJestConfig = {
    rootDir: rootDir,
    /**
     * Alias: -w. Specifies the maximum number of workers the worker-pool will spawn for running tests.
     * In single run mode, this defaults to the number of the cores available on your machine minus one for the main thread.
     * In watch mode, this defaults to half of the available cores on your machine to ensure Jest is unobtrusive and does not grind your machine to a halt.
     * It may be useful to adjust this in resource limited environments like CIs but the defaults should be adequate for most use-cases.
     * For environments with variable CPUs available, you can use percentage based configuration: --maxWorkers=50%
     */
    maxWorkers: '50%',
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
    testMatch: ['<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/**/?(*.)(spec|test).{js,jsx,ts,tsx}'],
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': resolve('lib/jest/babelTransform.js'),
      '^.+\\.(css|less|sass|scss)$': resolve('lib/jest/cssTransform.js'),
      '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': resolve('lib/jest/fileTransform.js'),
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$'],
    moduleNameMapper: {
      '^.+\\.module\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
  };

  const overrides: IJestConfig = Object.assign({}, require(path.join(rootDir, 'package.json')).jest);

  if (overrides) {
    const supportedKeys: string[] = [
      'collectCoverageFrom',
      'coverageReporters',
      'coverageThreshold',
      'globals',
      'mapCoverage',
      'moduleFileExtensions',
      'modulePathIgnorePatterns',
      'moduleNameMapper',
      'modulePaths',
      'snapshotSerializers',
      'setupFiles',
      'testMatch',
      'testEnvironmentOptions',
      'testResultsProcessor',
      'transform',
      'transformIgnorePatterns',
      'reporters',
    ];
    supportedKeys.forEach((key: string) => {
      if (overrides.hasOwnProperty(key)) {
        conf[key] = overrides[key];
        delete overrides[key];
      }
    });
    const unsupportedKeys = Object.keys(overrides);
    if (unsupportedKeys.length) {
      console.error(
        '\x1b[1;31mOut of the box, kkt only supports overriding \x1b[0m' +
          '\x1b[1;31mthese Jest options:\x1b[0m\n\n' +
          supportedKeys.map((key) => '  \u2022 ' + key).join('\n') +
          '.\n\n' +
          '\x1b[1;31mThese options in your package.json Jest configuration \x1b[0m' +
          '\x1b[1;31mare not currently supported by kkt:\x1b[0m\n\n' +
          unsupportedKeys.map((key) => '  \u2022 ' + key).join('\n'),
      );
      process.exit(1);
    }
  }
  return conf;
};
