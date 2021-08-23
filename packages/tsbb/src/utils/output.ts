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

export async function copyFiles(src: string, dest: string) {
  await FS.copy(src, dest);
  outputLog(dest);
}

export function outputLog(filename: string) {
  const extname = path.extname(filename).replace('.', '');
  if (/\.map$/.test(filename)) {
    console.log(`♻️ \x1b[36;1m MAP\x1b[0m  ┈┈▶ \x1b[32;1m${filename}\x1b[0m`);
  } else if (/d.ts$/.test(filename)) {
    console.log(`♻️ \x1b[34;1m DTS\x1b[0m  ┈┈▶ \x1b[32;1m${filename}\x1b[0m`);
  } else if (extname == 'css') {
    console.log(`♻️ \x1b[35;1m CSS \x1b[0m ┈┈▶ \x1b[32;1m${filename}\x1b[0m`);
  } else if (extname == 'js') {
    console.log(`♻️ \x1b[33;1m JS \x1b[0m  ┈┈▶ \x1b[32;1m${filename}\x1b[0m`);
  } else {
    console.log(`♻️ \x1b[37;1m ${(extname || '***').toLocaleUpperCase()} \x1b[0m ┈┈▶ \x1b[32;1m${filename}\x1b[0m`);
  }
}
