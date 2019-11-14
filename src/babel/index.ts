import fs from 'fs-extra';
import path from 'path';
import { IFileDirStat } from '../utils/getFileDirectory';
import transform from './transform';
import { IBuildArgs } from '../build';

async function transformFile(fileStat: IFileDirStat, args: IBuildArgs, cjsPath?: string) {
  const outputPath = cjsPath || fileStat.outputPath;
  const source = await transform(fileStat.path, {
    envName: args.currentEnvName,
    outputPath,
    sourceMaps: args.sourceMaps,
    comments: args.comments
  }, args.target);
  if (args.sourceMaps === true && source.map) {
    source.code = `${source.code} \n//# sourceMappingURL=${fileStat.name.replace(new RegExp(`.${fileStat.ext}$`, 'g'), '.js.map')}`;
    await fs.outputFile(outputPath.replace(/.js$/, '.js.map'), JSON.stringify(source.map));
  }
  await fs.outputFile(outputPath, source.code);
  console.log(`♻️  ${path.relative(source.options.root, fileStat.path)} -> \x1b[32;1m${path.relative(source.options.root, outputPath)}\x1b[0m`);
  return source;
}

export default async (files: IFileDirStat[], args: IBuildArgs) => {
  await Promise.all(files.map(async (item: IFileDirStat) => {
    // Exclude test files from the project directory.
    // TypeScript `配置文件` 和 `类型文件`
    if (
      /\.test\.(ts|tsx|js|jsx)$/.test(item.path)
      || /\.(snap)$/.test(item.path)
      || /(\.d\.ts|tsconfig\.json)$/.test(item.path)
    ) {
      return item;
    }
    try {
      if (args.target === 'node') {
        if (!/\.(ts|tsx|js|jsx)$/.test(item.path) && args.copyFiles) {
          await fs.copy(item.path, item.outputPath);
          return item;
        }
        await transformFile(item, args);
      } else if (args.target === 'react' && args.envName && args.envName.length > 0) {
        await Promise.all(args.envName.map(async (envName: string) => {
          /**
           * If `target=react`, the babel environment variable supports development mode.
           */
          const env = envName.split(':');
          let envDirName = envName;
          if (env.length > 1 && env[1] === 'dev') {
            envDirName = env[0];
          }
          const envPath = path.join(args.output, envDirName, item.outputPath.replace(args.output, ''));
          if ((!/\.(ts|tsx|js|jsx)$/.test(item.path)) && args.copyFiles) {
            await fs.copy(item.path, envPath);
            return item;
          }
          args.currentEnvName = envName;
          await transformFile(item, args, envPath);
        }));
      } else {
        console.log('⛑', 'The `--target` and `--env-name` parameters do not exist!');
      }
    } catch (error) {
      console.log('⛑', error.message, error);
    }
  }));
}