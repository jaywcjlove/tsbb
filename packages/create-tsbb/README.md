[![tsbb](https://user-images.githubusercontent.com/1680273/57547188-94c60100-7390-11e9-93b2-5ebf085bb925.png)](https://github.com/jaywcjlove/tsbb)

<p align="center">
  <a href="https://github.com/jaywcjlove/tsbb/actions">
    <img src="https://github.com/jaywcjlove/tsbb/workflows/Build%20&%20Deploy/badge.svg">
  </a>
  <a href="https://www.npmjs.com/package/create-tsbb">
    <img src="https://img.shields.io/npm/v/create-tsbb.svg">
  </a>
</p>

Creates a [`tsbb`](http://jaywcjlove.github.io/tsbb) application using the command line.

### Usage

```shell
# npm 7+, extra double-dash is needed:
$ npm init tsbb my-app -- --example typenexus
# npm 6.x
$ npm init tsbb my-app --example typenexus

# or npx
$ npx create-tsbb my-app
# or npm
$ npm create tsbb@latest my-app
$ yarn create tsbb [appName]
```

### Command Help

Below is a help of commands you might find useful.

```bash
Usage: create-tsbb <app-name> [options] [--help|h]
Options:

  --version, -v  Show version number
  --help, -h     Displays help information.
  --force, -f    Overwrite folder contents.
  --example, -e  Example: "npm create tsbb my-app -e typenexus",
                  default: "basic"

Example:

  yarn create tsbb appName
  npx create-tsbb my-app
  npm create tsbb my-app
  npm create tsbb@latest my-app
  # npm 7+, extra double-dash is needed:
  npm create tsbb@latest my-app -- -f
  npm create tsbb@latest my-app -- -e typenexus

Copyright 2023
```

## License

[MIT © Kenny Wong](https://github.com/jaywcjlove/tsbb/blob/master/LICENSE)
