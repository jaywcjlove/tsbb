
import fs from 'fs-extra';
import path from 'path';
import { ICompletePathArgs } from './utils';
import { IFileDirStat } from './utils/getFileDirectory';
import transform from './utils/transform';

export interface IBabelOption extends ICompletePathArgs {}

export default async (files: IFileDirStat[], args: IBabelOption) => {
  await Promise.all(files.map(async (item: IFileDirStat) => {
    try {
      const source = await transform(item.path, {
        outputPath: item.outputPath,
        sourceMaps: args.sourceMaps,
        comments: args.comments
      });
      if (args.sourceMaps === true && source.map) {
        await fs.outputFile(item.outputPath.replace(/.js$/, '.js.map'), JSON.stringify(source.map));
        source.code = `${source.code} \n//# sourceMappingURL=${item.name.replace(/.ts$/, '.js.map')}`;
      }
      await fs.outputFile(item.outputPath, source.code);
      console.log(`♻️  ${path.relative(source.options.root, item.path)} -> \x1b[32;1m${path.relative(source.options.root, item.outputPath)}\x1b[0m`);
    } catch (error) {
      console.log('⛑', error.message, error);
    }
  }));
}