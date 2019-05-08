TSBB
---

Zero-config CLI for TypeScript [Node.js](https://nodejs.org/en/) application development.

`TypeScript + Babel` = `TSBB`

## Usage

You will need `Node.js` installed on your system.

```bash
$ npm install tsbb --save-dev
```

## Command Help

```
▶ tsbb --help
Usage: tsbb [options]

Commands:
  tsbb watch  Recompile directory on changes.
  tsbb build  Build your project once and exit.

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

## Example

- [Basic](example/basic) - The [Node.js](https://nodejs.org/en/) base application example.
- [Koa](example/koa) - The [Koa](https://koajs.com/) base application example.
- [Express](example/express) - The [Express](https://expressjs.com/) base application example.