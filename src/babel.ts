
import fs from 'fs-extra';
import path from 'path';
import { IBuildArgs } from './command/build';
import { IFileDirStat } from './utils/getFileDirectory';
import transform from './utils/transform';

export interface IBabelOption extends IBuildArgs {}

export default async (files: IFileDirStat[], args: IBabelOption) => {
  await Promise.all(files.map(async (item: IFileDirStat) => {
    const source = await transform(item.path);
    const outpath = source.options.filename.replace(args.sourceRoot, args.output).replace(/\.ts$/g, '.js');
    await fs.outputFile(outpath, source.code);
    console.log(`♻️  ${path.relative(source.options.root, item.path)} -> \x1b[32;1m${path.relative(source.options.root, outpath)}\x1b[0m`);
  }));
}