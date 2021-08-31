import path from 'path';
import FS from 'fs-extra';
import * as ts from 'typescript';
import { BabelFileResult } from '@babel/core';

export async function outputFiles(filename: string, code: string, sourceMap?: BabelFileResult['map']) {
  ts.sys.writeFile(filename, code);
  if (sourceMap) {
    ts.sys.writeFile(`${filename}.map`, JSON.stringify(sourceMap, null, 2));
    outputLog(`${filename}.map`);
  }
  outputLog(filename);
}

export function copyFiles(src: string, dest: string) {
  FS.copySync(src, dest);
  outputLog(dest);
}

export function outputLog(filename: string) {
  const pkg = getPkg();
  const extname = path.extname(filename).replace('.', '');
  const name = `\x1b[35m ${pkg.name}\x1b[0m`;
  if (/\.map$/.test(filename)) {
    console.log(`♻️ ${name}\x1b[36;1m MAP\x1b[0m ┈┈▶ \x1b[32;1m${filename}\x1b[0m`);
  } else if (/d.ts$/.test(filename)) {
    console.log(`♻️ ${name}\x1b[34;1m DTS\x1b[0m ┈┈▶ \x1b[32;1m${filename}\x1b[0m`);
  } else if (extname == 'css') {
    console.log(`♻️ ${name}\x1b[35;1m CSS \x1b[0m┈┈▶ \x1b[32;1m${filename}\x1b[0m`);
  } else if (extname == 'js') {
    console.log(`♻️ ${name}\x1b[33;1m JS \x1b[0m ┈┈▶ \x1b[32;1m${filename}\x1b[0m`);
  } else {
    console.log(`♻️ ${name}\x1b[37;1m ${(extname || '***').toLocaleUpperCase()} \x1b[0m ┈┈▶ \x1b[32;1m${filename}\x1b[0m`);
  }
}

function getPkg() {
  const dir = ts.sys.getCurrentDirectory();
  const pkgPath = path.resolve(dir, 'package.json');
  return FS.readJSONSync(pkgPath) || {};
}