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
  <a href="https://www.npmjs.com/package/create-tsbb">
    <img src="https://img.shields.io/npm/v/create-tsbb.svg">
  </a>
</p>

Creates a [`tsbb`](https://www.travis-ci.org/jaywcjlove/tsbb) application using the command line.

### Usage

```shell
# npm 6.x
$ npm init tsbb my-app --example express-typeorm
# npm 7+, extra double-dash is needed:
$ npm init tsbb my-app -- --example express-typeorm

$ yarn create tsbb [appName]
# or npm
$ npm create tsbb my-app
# or npx
$ npx create-tsbb my-app
```

### Command Help

Below is a help of commands you might find useful. The example download is from https://jaywcjlove.github.io/tsbb

```bash
Usage: create-tsbb <app-name> [options] [--help|h]

Options:
  --version, -v Show version number
  --help, -h Displays help information.
  --output, -o Output directory.
  --example, -e Example from: https://jaywcjlove.github.io/tsbb , default: "basic"
  --force, -f Overwrite target directory if it exists. default: false
  --path, -p Specify the download target git address. default: "https://jaywcjlove.github.io/tsbb"

Example:
  npx create-tsbb my-app
  yarn create tsbb appName
  npm create tsbb my-app
  npm create tsbb my-app -f
  npm create tsbb my-app -p https://jaywcjlove.github.io/tsbb

Copyright 2021
```

## License

[MIT © Kenny Wong](https://github.com/jaywcjlove/tsbb/blob/master/LICENSE)
