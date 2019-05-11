import path from 'path';
import color from 'colors-cli';
import Jest from '@jest/types';

interface IJestConfig extends Jest.Config.InitialOptions {
  [key: string]: any;
}

export default (resolve: Function, rootDir: string) => {
  const conf: IJestConfig = {
    rootDir: rootDir,
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
    ],
    testMatch: [
      '<rootDir>/**/__tests__/**/*.{ts,tsx}',
      '<rootDir>/**/?(*.)(spec|test).{ts,tsx}',
    ],
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': resolve('lib/jest/babelTransform.js'),
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    ],
  }

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
        color.red(
          'Out of the box, kkt only supports overriding ' +
          'these Jest options:\n\n' +
          supportedKeys.map(key => color.bold('  \u2022 ' + key)).join('\n') +
          '.\n\n' +
          'These options in your package.json Jest configuration ' +
          'are not currently supported by kkt:\n\n' +
          unsupportedKeys.map(key => color.bold('  \u2022 ' + key)).join('\n')
        )
      );
      process.exit(1);
    }
  }
  return conf;
}