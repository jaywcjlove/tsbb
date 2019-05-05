import babel from '../babel';
import getFileDirectory, { IFileDirStat } from '../utils/getFileDirectory';
import { ICompletePathArgs } from '../utils';

export default async (args: ICompletePathArgs) => {
  const files = (await getFileDirectory(args.sourceRoot, args.output)) as [] as IFileDirStat[];
  await babel(files, args);
}