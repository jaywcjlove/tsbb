import fs from 'fs';
import path from 'path';
import { sum } from '../src/utils/sum';
import { abs } from '../src/main';

const dirSrc = path.resolve('lib');

it('sum test case', async () => {
  expect(sum(1, 1)).toEqual(4);
  expect(abs(1, 1)).toEqual(2);
});

it('output files test case.', async () => {
  const dirs = await fs.promises.readdir(dirSrc);
  expect(dirs).toEqual(expect.arrayContaining(["index.d.ts", "index.js", "index.js.map", "utils", "main.js", "main.d.ts", "main.js.map"]));
});