import path from 'path';
import fs from 'fs';

export async function getEntity(entityPath: string = '../entity') {
  const dirPath = path.resolve(__dirname, entityPath);
  const dirArr = await fs.promises.readdir(dirPath);
  const arr: any[] = [];
  dirArr.forEach((fileName) => {
    const ePath = path.resolve(dirPath, fileName).replace(/\.(js|ts)$/, '');
    const handle = require(ePath);
    Object.keys(handle).forEach((funName) => {
      arr.push(handle[funName]);
    });
  });
  return arr;
}
