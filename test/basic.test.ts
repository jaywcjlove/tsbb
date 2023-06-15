import fs from 'fs';
import path from 'path';

const dirPath = path.resolve(process.cwd(), 'examples/basic');

it('basic example test case', async () => {
  const dirs = await fs.promises.readdir(dirPath);
  expect(dirs.includes('lib')).toBeTruthy();

  const mainConCJSPath = path.resolve(dirPath, 'lib/index.js');
  const cjsCon = await fs.promises.readFile(mainConCJSPath, 'utf-8');
  expect(cjsCon.includes(`exports.default`)).toBeTruthy();

  const jpegPath = path.resolve(dirPath, 'lib/test/avatar.jpeg');
  expect(fs.existsSync(jpegPath)).toBeTruthy();

  const mainCJSPath = path.resolve(dirPath, 'lib/main.js');
  const mainCon = await fs.promises.readFile(mainCJSPath, 'utf-8');
  expect(mainCon.includes(`exports.abs`)).toBeTruthy();
  expect(mainCon.includes(`exports.default`)).toBeFalsy();


  const sumCJSPath = path.resolve(dirPath, 'lib/test/sum.js');
  const sumCon = await fs.promises.readFile(sumCJSPath, 'utf-8');
  expect(sumCon.includes(`./avatar.jpeg`)).toBeTruthy();
});
