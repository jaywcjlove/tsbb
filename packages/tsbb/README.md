[![tsbb](https://user-images.githubusercontent.com/1680273/57547188-94c60100-7390-11e9-93b2-5ebf085bb925.png)](https://github.com/jaywcjlove/tsbb)

<p align="center">
  <a href="https://github.com/jaywcjlove/tsbb/actions">
    <img src="https://github.com/jaywcjlove/tsbb/workflows/Build%20&%20Deploy/badge.svg">
  </a>
  <a href="https://github.com/jaywcjlove/tsbb/issues">
    <img src="https://img.shields.io/github/issues/jaywcjlove/tsbb.svg">
  </a>
  <a href="https://github.com/jaywcjlove/tsbb/network">
    <img src="https://img.shields.io/github/forks/jaywcjlove/tsbb.svg">
  </a>
  <a href="https://github.com/jaywcjlove/tsbb/stargazers">
    <img src="https://img.shields.io/github/stars/jaywcjlove/tsbb.svg">
  </a>
  <a href="https://github.com/jaywcjlove/tsbb/releases">
    <img src="https://img.shields.io/github/release/jaywcjlove/tsbb.svg">
  </a>
  <a href="https://www.npmjs.com/package/tsbb">
    <img src="https://img.shields.io/npm/v/tsbb.svg">
  </a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> · 
  <a href="#example">Example</a> · 
  <a href="#command-help">Command Help</a> · 
  <a href="https://www.npmjs.com/package/tsbb">npm</a> · 
  <a href="#license">License</a>
</p>

TSBB is a zero-config CLI that helps you develop, test, and publish modern TypeScript [Node.js](https://nodejs.org/en/) project.

`TypeScript + Babel` = `TSBB`

#### `Features`

- ⏱ Quickly initialize the example project and quickly enter the development mode.  
- ♻️ Recompile the code when project files get added, removed or modified.  
- 📚 Readable source code that encourages learning and contribution  
- 🚀 Faster, Faster compilation speed.  
- ⚛️ Support [react](https://reactjs.org/) component compilation.  
- ⛑ [Jest](https://jestjs.io/) test runner setup with defaults `tsbb test`  
- 🔥 Zero-config, single dependency.  

## Quick Start

You will need `Node.js` installed on your system.

```shell
$ yarn create tsbb [appName]
# or npm
$ npm create tsbb my-app -e express
# --- Example name ---------┴ˇˇˇˇˇˇ
# or npx
$ npx create-tsbb my-app -e koa

# npm 6.x
$ npm init tsbb my-app --example express-typeorm
# npm 7+, extra double-dash is needed:
$ npm init tsbb my-app -- --example express-typeorm

$ cd my-project

$ npm run watch # Listen compile .ts files.
$ npm run build # compile .ts files.
$ npm start
```

## Example

[create-tsbb](https://github.com/jaywcjlove/tsbb/tree/master/packages/create-tsbb) initialize the project from one of the examples:

```shell
$ npx create-tsbb my-app -e <Example Name>
# --- E.g: ----------------┴ˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
# npx create-tsbb my-app -e Basic
```

You can download the following examples directly. [Download page](https://jaywcjlove.github.io/tsbb).

- [**`Basic`**](https://github.com/jaywcjlove/tsbb/tree/master/example/basic) - The [Node.js](https://nodejs.org/en/) base application example.
- [**`Express`**](https://github.com/jaywcjlove/tsbb/tree/master/example/express) - The [Express](https://expressjs.com/) base application example.
- [**`express-typeorm`**](https://github.com/jaywcjlove/tsbb/tree/master/example/express-typeorm) - The [Express](https://expressjs.com/) & [TypeORM](https://github.com/typeorm/typeorm) base application example.
- [**`Koa`**](https://github.com/jaywcjlove/tsbb/tree/master/example/koa) - The [Koa](https://koajs.com/) base application example.
- [**`Hapi`**](https://github.com/jaywcjlove/tsbb/tree/master/example/hapi) - The [Hapi](https://hapijs.com/) base application example.
- [**`react-component`**](https://github.com/jaywcjlove/tsbb/tree/master/example/react-component) - The react component base application example.
- [**`react-component-tsx`**](https://github.com/jaywcjlove/tsbb/tree/master/example/react-component-tsx) - The react component and website base application example.

## Command Help

Below is a help of commands you might find useful.

### `tsbb`

```shell
▶ tsbb --help

Usage: tsbb <command>
Version 3.0.0-rc.14

Commands:

  tsbb build [options]         Build your project once and exit.
  tsbb watch [options]         Recompile files on changes.
  tsbb test [options]          Run jest test runner in watch mode.

Options:[build|watch]

  --entry, -e               Specify the entry directory.
  --envName                 The current active environment used during configuration loading.
  --disable-babel           Disable Babel.
  --disable-babel-option    Disable Babel Option.
  --esm                     Output "esm" directory.
  --cjs                     Output "cjs" directory.

Examples:

  $ tsbb build                           Build your project.
  $ tsbb build --entry src/index.ts      Specify the entry directory.
  $ tsbb build --esm ./es                Output directory.
  $ tsbb watch --disable-babel-option    Disable Babel Option.
  $ tsbb watch --disable-babel           Disable Babel.
  $ tsbb watch --cjs ./cjs               Watch Output directory.
  $ tsbb test                            Run test suites related
  $ tsbb test --coverage                 Test coverage information should be collected

Options:

  --version, -v                      Show version number
  --help, -h                         Show help

Copyright 2021
```

### ~~`tsbb create`~~

Please use [create-tsbb](https://github.com/jaywcjlove/tsbb/tree/master/packages/create-tsbb) to create an example.

### `tsbb test`

Runs the test watcher ([Jest](https://jestjs.io/docs/cli)) in an interactive mode.

```shell
$ tsbb test                          Run test suites related
$ tsbb test --coverage --no-color    Test coverage information should be collected
```

```ts
export declare type Argv = Arguments<Partial<{
  all: boolean;
  automock: boolean;
  bail: boolean | number;
  cache: boolean;
  cacheDirectory: string;
  changedFilesWithAncestor: boolean;
  changedSince: string;
  ci: boolean;
  clearCache: boolean;
  clearMocks: boolean;
  collectCoverage: boolean;
  collectCoverageFrom: string;
  collectCoverageOnlyFrom: Array<string>;
  color: boolean;
  colors: boolean;
  config: string;
  coverage: boolean;
  coverageDirectory: string;
  coveragePathIgnorePatterns: Array<string>;
  coverageReporters: Array<string>;
  coverageThreshold: string;
  debug: boolean;
  env: string;
  expand: boolean;
  findRelatedTests: boolean;
  forceExit: boolean;
  globals: string;
  globalSetup: string | null | undefined;
  globalTeardown: string | null | undefined;
  haste: string;
  init: boolean;
  injectGlobals: boolean;
  json: boolean;
  lastCommit: boolean;
  logHeapUsage: boolean;
  maxWorkers: number | string;
  moduleDirectories: Array<string>;
  moduleFileExtensions: Array<string>;
  moduleNameMapper: string;
  modulePathIgnorePatterns: Array<string>;
  modulePaths: Array<string>;
  noStackTrace: boolean;
  notify: boolean;
  notifyMode: string;
  onlyChanged: boolean;
  onlyFailures: boolean;
  outputFile: string;
  preset: string | null | undefined;
  projects: Array<string>;
  prettierPath: string | null | undefined;
  resetMocks: boolean;
  resetModules: boolean;
  resolver: string | null | undefined;
  restoreMocks: boolean;
  rootDir: string;
  roots: Array<string>;
  runInBand: boolean;
  selectProjects: Array<string>;
  setupFiles: Array<string>;
  setupFilesAfterEnv: Array<string>;
  showConfig: boolean;
  silent: boolean;
  snapshotSerializers: Array<string>;
  testEnvironment: string;
  testFailureExitCode: string | null | undefined;
  testMatch: Array<string>;
  testNamePattern: string;
  testPathIgnorePatterns: Array<string>;
  testPathPattern: Array<string>;
  testRegex: string | Array<string>;
  testResultsProcessor: string;
  testRunner: string;
  testSequencer: string;
  testURL: string;
  testTimeout: number | null | undefined;
  timers: string;
  transform: string;
  transformIgnorePatterns: Array<string>;
  unmockedModulePathPatterns: Array<string> | null | undefined;
  updateSnapshot: boolean;
  useStderr: boolean;
  verbose: boolean;
  version: boolean;
  watch: boolean;
  watchAll: boolean;
  watchman: boolean;
  watchPathIgnorePatterns: Array<string>;
}>>;
```

## Development

```bash
$ npm i
$ npm run hoist
$ npm run build
```

## License

MIT © [Kenny Wong](https://wangchujiang.com)
