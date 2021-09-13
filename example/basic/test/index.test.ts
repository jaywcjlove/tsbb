import fs from 'fs';
import path from 'path';
import { sum } from '../src/utils/sum';

const dirSrc = path.resolve('lib');

it('sum test case', async () => {
  expect(sum(1, 1)).toEqual(4);
});

it('output files test case.', async () => {
  const dirs = await fs.promises.readdir(dirSrc);
  expect(dirs).toEqual(expect.arrayContaining(["index.d.ts", "index.js", "index.js.map", "utils"]));
});