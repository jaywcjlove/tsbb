[![tsbb](https://user-images.githubusercontent.com/1680273/57547188-94c60100-7390-11e9-93b2-5ebf085bb925.png)](https://github.com/jaywcjlove/tsbb)

<p align="center">
  <a href="https://github.com/jaywcjlove/tsbb/actions/workflows/ci.yml">
    <img alt="Build & Deploy" src="https://github.com/jaywcjlove/tsbb/actions/workflows/ci.yml/badge.svg">
  </a>
  <a href="https://www.npmjs.com/package/tsbb">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/tsbb.svg?style=flat">
  </a>
  <a href="https://uiwjs.github.io/npm-unpkg/#/pkg/tsbb/file/README.md">
    <img alt="Open in unpkg" src="https://img.shields.io/badge/Open%20in-unpkg-blue">
  </a>
  <a href="https://www.npmjs.com/package/tsbb">
    <img alt="npm version" src="https://img.shields.io/npm/v/tsbb.svg">
  </a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> · 
  <a href="#example">Example</a> · 
  <a href="#command-help">Command Help</a> · 
  <a href="https://www.npmjs.com/package/tsbb">npm</a> · 
  <a href="#license">License</a>
</p>

TSBB is a CLI tool for developing, testing and publishing modern TypeScript projects with zero configuration, and can also be used for module or react component development.

`TypeScript + Babel` = `TSBB`

Migrate from tsbb [3.x to 4.x](https://github.com/jaywcjlove/tsbb/issues/439).

## `Features`

- 🔥 Single dependency zero-configuration
- ⏱ Quick initialization of example projects and entering development mode
- ♻️ Automatic recompilation of code when files are added, modified, or removed
- 📚 Readable source code that encourages learning and contribution
- 🚀 Faster compilation speeds
- ⚛️ Support for [React](https://react.dev) and [Vue 3](https://vuejs.org) component compilation
- ⛑ [Jest](https://jestjs.io/) test runner setup with defaults of `tsbb test`

## Quick Start

You will need `Node.js` installed on your system.

```shell
$ yarn create tsbb [appName]
# or npm
$ npm create tsbb@latest my-app -- -e express
# --- Example name ------┴ˇˇˇˇˇ
# or npx
$ npx create-tsbb@latest my-app -e koa

# npm 7+, extra double-dash is needed:
$ npm init tsbb my-app -- --example typenexus
# npm 6.x
$ npm init tsbb my-app --example typenexus

$ cd my-project

$ npm run watch # Listen compile .ts files.
$ npm run build # compile .ts files.
$ npm start
```

1️⃣ Installation & Setup

```bash
$ npm i -D microbundle
```

2️⃣ Set up your `package.json`:

```json
{
  "name": "@pkg/basic",
  "version": "1.0.0",
  "main": "./cjs/index.js",      // where to generate the CommonJS bundle
  "module": "./esm/index.js",    // where to generate the ESM bundle
  "exports": {
    "require": "./cjs/index.js", // used for require() in Node 12+
    "default": "./esm/index.js"  // where to generate the modern bundle (see below)
  },
  "scripts": {
    "watch": "tsbb watch",
    "build": "tsbb build --bail",
    "test": "tsbb test",
    "coverage": "tsbb test --coverage --bail"
  },
  "devDependencies": {
    "tsbb": "4.1.14"
  }
}
```

3️⃣ Try it out by running npm run build.

## Example

[create-tsbb](https://github.com/jaywcjlove/tsbb/tree/master/packages/create-tsbb) initialize the project from one of the examples:

```shell
$ npx create-tsbb my-app -e <Example Name>
# --- E.g: ----------------┴ˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
# npx create-tsbb my-app -e Basic
```

You can download the following examples directly. [Download page](https://jaywcjlove.github.io/tsbb).

- [**`basic`**](https://github.com/jaywcjlove/tsbb/tree/master/examples/basic) - The [Node.js](https://nodejs.org/en/) base application example.
- [**`babel-transform-ts`**](https://github.com/jaywcjlove/tsbb/tree/master/examples/babel-transform-ts) - Babel Transform Typescript Example.
- [**`express`**](https://github.com/jaywcjlove/tsbb/tree/master/examples/express) - The [Express](https://expressjs.com/) base application example.
- [**`typenexus`**](https://github.com/jaywcjlove/tsbb/tree/master/examples/typenexus) - The [Express](https://expressjs.com/) & [TypeORM](https://github.com/typeorm/typeorm) base application example.
- [**`koa`**](https://github.com/jaywcjlove/tsbb/tree/master/examples/koa) - The [Koa](https://koajs.com/) base application example.
- [**`hapi`**](https://github.com/jaywcjlove/tsbb/tree/master/examples/hapi) - The [Hapi](https://hapijs.com/) base application example.
- [**`react-component`**](https://github.com/jaywcjlove/tsbb/tree/master/examples/react-component) - The react component base application example.
- [**`react-component-tsx`**](https://github.com/jaywcjlove/tsbb/tree/master/examples/react-component-tsx) - The react component and website base application example.
- [**`transform-typescript`**](https://github.com/jaywcjlove/tsbb/tree/master/examples/transform-typescript) - Reconfigure the babel configuration example.
- [**`umd`**](https://github.com/jaywcjlove/tsbb/tree/master/examples/umd) - umd bundle example.
- [**`vue`**](https://github.com/jaywcjlove/tsbb/tree/master/examples/vue) - To add Vue 3 JSX support.

## TypeScript Project

To configure the **`tsconfig.json`** properly, you must first define either the **`include`** or **`files`** field(s) to specify which files need to be compiled. Once you've done that, you can then specify the **`outDir`** for the output directory in the configuration.

```typescript
{
  "$schema": "http://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "module": "commonjs",
    "target": "esnext",
    "outDir": "./lib",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ]
}
```

After completing `tsconfig.jso` configuration, you can configure _scripts_ in `package.json`:

```javascript
{
  "scripts": {
    "watch": "tsbb watch",
    "build": "tsbb build"
  },
  "devDependencies": {
    "tsbb": "*"
  }
}
```

## Babel Project

Adding the parameter `--use-babel` to your project enables babel to compile and output **`cjs`**/**`esm`** files simultaneously, while **`ts`** is only needed for *type* output.

```bash
$ tsbb build "src/*ts" --use-babel
```

You can change the built-in settings of Babel by adding a **`.babelrc`** configuration file. Additionally, you can modify the **Babel** configurations for **`esm`** and **`cjs`** separately through environment variables. Please refer to the example below:

```js
{
  "env": {
    "cjs": {
      "presets": ["@babel/preset-typescript"]
    },
    "esm": {
      "presets": ["@babel/preset-env", {
        "modules": false,
        "loose": true,
        "targets": {
          "esmodules": true,
        },
      }]
    }
  } 
}
```

At compile time, specify the environment variable `--envName='xxx'` to enable reading of relevant configurations from the settings. This environment variable can also be customized.

```js
{
  "env": {
    "xxx": { ... }
  } 
}
```

## Command Help

Below is a help of commands you might find useful.

### `tsbb`

```shell
▶ tsbb --help

Usage: tsbb <command>

Commands:

  tsbb build [source…] [options]   Build your project once and exit.
  tsbb watch [source…] [options]   Recompile files on changes.
  tsbb test [options]              Run jest test runner in watch mode.
  tsbb copy|cpy <source …> [options]   Copy files.

Options:[build|watch]

  --bail                     Exit the compile as soon as the compile fails(default: true).
  --use-babel                Use Babel.(works in babel)
  --source-maps              Enables the generation of sourcemap files.(works in babel)
  --env-name                 The current active environment used during configuration loading.(works in babel)
  --esm                      Output "esm" directory.(works in babel)
  --cjs                      Output "cjs" directory.(works in babel)

Options:

  --version, -v              Show version number
  --help, -h                 Show help

Examples:

  $ tsbb build src/*.ts                    Build your project.
  $ tsbb build src/main.ts src/good.ts     Specify the entry directory.
  $ tsbb build src/*.ts --use-babel --no-source-maps   No ".js.map" file is generated. (works in babel)
  $ tsbb watch src/*.ts --use-babel --cjs ./cjs        Watch Output directory.
  $ tsbb build src/*.ts --use-babel --esm ./es         Output directory.
  $ tsbb build src/*.ts --use-babel --use-vue          To add Vue JSX support.
  $ tsbb test                              Run test suites related
  $ tsbb test --coverage --bail            Test coverage information should be collected
  $ tsbb copy  'src/*.png' '!src/goat.png' --output dist     Copy files.
  $ tsbb copy  'src/*.png' 'src/goat.{js,d.ts}' --output dist --watch

  Copyright 2023

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
$ npm run build
```

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/jaywcjlove/tsbb/graphs/contributors">
  <img src="http://jaywcjlove.github.io/tsbb/CONTRIBUTORS.svg" />
</a>

Made with [contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

MIT © [Kenny Wong](https://wangchujiang.com)
