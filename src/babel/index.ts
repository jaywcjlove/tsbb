import fs from 'fs-extra';
import path from 'path';
import { IFileDirStat } from '../utils/getFileDirectory';
import transform, { ITransformResult } from './transform';
import { IBuildArgs } from '../command/build';

async function transformFile(fileStat: IFileDirStat, args: IBuildArgs, cjsPath?: string) {
  const source = await transform(fileStat.path, {
    outputPath: cjsPath || fileStat.outputPath,
    sourceMaps: args.sourceMaps,
    comments: args.comments
  }, args.target);
  if (args.sourceMaps === true && source.map) {
    source.code = `${source.code} \n//# sourceMappingURL=${fileStat.name.replace(new RegExp(`.${fileStat.ext}$`, 'g'), '.js.map')}`;
    await fs.outputFile(cjsPath.replace(/.js$/, '.js.map'), JSON.stringify(source.map));
  }
  await fs.outputFile(cjsPath, source.code);
  return source;
}

export default async (files: IFileDirStat[], args: IBuildArgs) => {
  await Promise.all(files.map(async (item: IFileDirStat) => {
    // Exclude test files from the project directory.
    if (/\.test\.(ts|tsx)$/.test(item.path)) {
      return item;
    }
    if (!/(ts|tsx)/.test(item.ext) && args.copyFiles) {
      await fs.copy(item.path, item.outputPath);
      return item;
    }
    try {
      if (args.target === 'node') {
        const source: ITransformResult = await transformFile(item, args);
        console.log(`♻️  ${path.relative(source.options.root, item.path)} -> \x1b[32;1m${path.relative(source.options.root, item.outputPath)}\x1b[0m`);
      } else if (args.target === 'react') {
        process.env.BABEL_ENV = 'cjs';
        const cjsPath = path.join(args.output, 'cjs', item.outputPath.replace(args.output, ''));
        let source: ITransformResult = await transformFile(item, args, cjsPath);
        console.log(`♻️  ${path.relative(source.options.root, item.outputPath)} -> \x1b[32;1m${path.relative(source.options.root, cjsPath)}\x1b[0m`);

        process.env.BABEL_ENV = 'esm';
        const esmPath = path.join(args.output, 'esm', item.outputPath.replace(args.output, ''));
        source = await transformFile(item, args, esmPath);
        console.log(`♻️  ${path.relative(source.options.root, item.outputPath)} -> \x1b[32;1m${path.relative(source.options.root, esmPath)}\x1b[0m`);
      }
    } catch (error) {
      console.log('⛑', error.message, error);
    }
  }));
}