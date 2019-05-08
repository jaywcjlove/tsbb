![tsbb](https://user-images.githubusercontent.com/1680273/57388344-9229a700-71ea-11e9-8495-1d299aed7888.png)

<p align="center">
  <a href="https://github.com/jaywcjlove/tsbb/issues">
    <img src="https://badgen.net/github/issues/jaywcjlove/tsbb">
  </a>
  <a href="https://github.com/jaywcjlove/tsbb/network">
    <img src="https://badgen.net/github/forks/jaywcjlove/tsbb">
  </a>
  <a href="https://github.com/jaywcjlove/tsbb/stargazers">
    <img src="https://badgen.net/github/stars/jaywcjlove/tsbb">
  </a>
  <a href="https://github.com/jaywcjlove/tsbb/releases">
    <img src="https://badgen.net/github/release/jaywcjlove/tsbb">
  </a>
  <a href="https://www.npmjs.com/package/tsbb">
    <img src="https://badgen.net/npm/v/tsbb">
  </a>
</p>

TSBB is a zero-config CLI that helps you develop, test, and publish modern TypeScript [Node.js](https://nodejs.org/en/) project.

`TypeScript + Babel` = `TSBB`

## Usage

You will need `Node.js` installed on your system.

```bash
$ npm install tsbb --save-dev
```

## Command Help

### `tsbb`

```shell
▶ tsbb --help

Usage: tsbb [options]

Commands:
  tsbb.js watch  Recompile directory on changes.
  tsbb.js build  Build your project once and exit.

Options:
  --version          Show version number                               [boolean]
  --source-root, -s  The root from which all sources are relative.
                                                       [string] [default: "src"]
  --copy-files       When compiling a directory copy over non-compilable files.
                                                       [boolean] [default: true]
  --source-maps      Source Map options.
               [string] [choices: true, false, "inline", "both"] [default: true]
  --output, -o       Output directory.                 [string] [default: "lib"]
  --help             Show help                                         [boolean]

Examples:

  $ tsdd build                Build your project once and exit.
  $ tsdd watch                Rebuilds on any change.
  $ tsdd watch --no-comments  Rebuilds on any change.

Copyright 2019
```

### `tsbb build`

```shell
▶ tsbb build --help

Build your project once and exit.

Options:
  --version          Show version number                               [boolean]
  --source-root, -s  The root from which all sources are relative.
                                                       [string] [default: "src"]
  --copy-files       When compiling a directory copy over non-compilable files.
                                                       [boolean] [default: true]
  --source-maps      Source Map options.
               [string] [choices: true, false, "inline", "both"] [default: true]
  --output, -o       Output directory.                 [string] [default: "lib"]
  --help             Show help                                         [boolean]
  --comments         decide whether a given comment should be included in the
                     output code.                     [boolean] [default: false]

Examples:
  $ tsbb build                Build your project.
  $ tsbb build --no-comments  Build your project and remove the comments.
```

### `tsbb watch`

```
▶ tsbb watch --help

Recompile directory on changes.

Options:
  --version          Show version number                               [boolean]
  --source-root, -s  The root from which all sources are relative.
                                                       [string] [default: "src"]
  --copy-files       When compiling a directory copy over non-compilable files.
                                                       [boolean] [default: true]
  --source-maps      Source Map options.
               [string] [choices: true, false, "inline", "both"] [default: true]
  --output, -o       Output directory.                 [string] [default: "lib"]
  --help             Show help                                         [boolean]
  --timer, -t        Compile interval.                   [number] [default: 300]
  --comments         decide whether a given comment should be included in the
                     output code.                      [boolean] [default: true]

Examples:
  $ tsbb watch   Rebuilds on any change.
```

## Example

- [Basic](example/basic) - The [Node.js](https://nodejs.org/en/) base application example.
- [Koa](example/koa) - The [Koa](https://koajs.com/) base application example.
- [Express](example/express) - The [Express](https://expressjs.com/) base application example.

## License

MIT © Kenny Wong