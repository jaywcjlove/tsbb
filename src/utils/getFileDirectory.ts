import fs from 'fs-extra';
import path from 'path';
import { getExt } from './';

export interface IFileDirStat {
  name: string;
  path: string;
  outputPath?: string;
  ext?: string;
  size?: number;
  isDirectory?: boolean;
  isFile?: boolean;
}

async function getFiles(rootPath: string, outpuPath: string, files: IFileDirStat[]) {
  const filesData = await fs.readdir(rootPath);
  const fileDir: IFileDirStat[] = filesData.map(file => ({
    name: file,
    path: path.join(rootPath, file),
    outputPath: path.join(rootPath, file).replace(rootPath, outpuPath),
  }));
  await Promise.all(fileDir.map(async (item: IFileDirStat) => {
    const stat = await fs.stat(item.path);
    item.size = stat.size;
    item.ext = '';
    if (stat.isDirectory()) {
      // item.ext = 'dir';
      // item.isDirectory = true;
      files = files.concat(await getFiles(item.path, outpuPath, []));
    } else if (stat.isFile()) {
      item.ext = getExt(item.path);
      item.isFile = true;
      files.push(item);
      if (/ts$/.test(item.ext)) {
        item.outputPath = item.outputPath.replace(new RegExp(`.${item.ext}$`), '.js');
      }
    }
    return item;
  }));
  return files;
}

export default async (rootPath: string, outpuPath?: string) => {
  return await getFiles(rootPath, outpuPath, []);
}