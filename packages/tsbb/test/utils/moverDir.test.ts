import { getFiles } from '../../src/utils/moverDir';
import path from 'path';

describe('utils test case', () => {
  it('getFiles', async () => {
    let files = await getFiles(__dirname, []);
    expect(files).toEqual(expect.arrayContaining([path.join(__dirname, 'moverDir.test.ts')]))

    files = await getFiles(path.join(__dirname, '..'), []);
    expect(files).toEqual(expect.arrayContaining([
      path.join(__dirname, 'moverDir.test.ts'),
      path.join(__dirname, 'index.test.ts'),
    ]))
  });
});
