import babel from '../babel';
import path from 'path';
import { Arguments } from 'yargs';
import getFileDirectory, { IFileDirStat } from '../utils/getFileDirectory';

export interface IBuildArgs extends Arguments {
  sourceRoot: string;
  output: string;
  [key: string]: any;
}

export default async (args: IBuildArgs) => {
  args.sourceRoot = path.resolve(process.cwd(), args.sourceRoot || '');
  args.s = args.sourceRoot;
  args.output = path.resolve(process.cwd(), args.output || '');
  args.o = args.output;
  const files = (await getFileDirectory(args.sourceRoot, args.output)) as [] as IFileDirStat[];
  await babel(files, args);
}