Express Example
===

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/s/github/jaywcjlove/tsbb/tree/master/example/express)

Compile files.

```shell
$ npx create-kkt my-app -e express
cd my-app
$ npm install

npm run watch # Listen compile .ts files.
npm run build # compile .ts files.
```

Production mode starts the service.

```bash
npm run start
```

Automatically restarting the node application when file changes in the directory are detected.

```bash
npm run dev 
```