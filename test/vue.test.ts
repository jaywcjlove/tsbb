import fs from 'fs';
import path from 'path';
import { buildExample } from '../scripts/build-example';

const vueDirPath = path.resolve(process.cwd(), 'examples/vue');

beforeAll(() => {
  buildExample('vue', ['build', 'src/*.tsx', '--use-vue', '--use-babel', '--cjs', 'cjs', '--bail']);
});

it('vue example test case', async () => {
  const dirs = await fs.promises.readdir(vueDirPath);
  expect(dirs.includes('cjs')).toBeTruthy();
  expect(dirs.includes('esm')).toBeTruthy();
  const mainConESMPath = path.resolve(vueDirPath, 'esm/index.js');
  const esmCon = await fs.promises.readFile(mainConESMPath, 'utf-8');
  expect(esmCon.includes(`vue`)).toBeTruthy();
  expect(esmCon.includes(`createVNode`)).toBeTruthy();
  expect(esmCon.includes(`createTextVNode`)).toBeTruthy();
  expect(esmCon.includes(`export default`)).toBeTruthy();

  const mainConCJSPath = path.resolve(vueDirPath, 'cjs/index.js');
  const cjsCon = await fs.promises.readFile(mainConCJSPath, 'utf-8');
  expect(cjsCon.includes(`vue`)).toBeTruthy();
  expect(cjsCon.includes(`exports["default"]`)).toBeTruthy();
  expect(/(require\([",']vue[",']\))/.test(cjsCon)).toBeTruthy();
});
