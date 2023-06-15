import fs from 'fs';
import path from 'path';

const dirPath = path.resolve(process.cwd(), 'examples/react-component-tsx');

it('react-component-tsx example test case', async () => {
  const dirs = await fs.promises.readdir(dirPath);
  expect(dirs.includes('lib')).toBeTruthy();
  expect(dirs.includes('esm')).toBeTruthy();
  const mainConESMPath = path.resolve(dirPath, 'esm/index.js');
  const esmCon = await fs.promises.readFile(mainConESMPath, 'utf-8');
  expect(esmCon.includes(`/logo.png`)).toBeTruthy();
  expect(esmCon.includes(`export default `)).toBeTruthy();
  expect(/(import\sReact\sfrom\s)/.test(esmCon)).toBeTruthy();

  const mainConCJSPath = path.resolve(dirPath, 'lib/index.js');
  const cjsCon = await fs.promises.readFile(mainConCJSPath, 'utf-8');
  expect(cjsCon.includes(`/logo.png`)).toBeTruthy();
  expect(cjsCon.includes(`exports.default`)).toBeTruthy();

  const jpegPath = path.resolve(dirPath, 'lib/logo.png');
  expect(fs.existsSync(jpegPath)).toBeTruthy();
});
