import path from 'path';
import color from 'colors-cli';
import fs from 'fs-extra';
import { IMyYargsArgs } from '../utils';

export default async (args: IMyYargsArgs) => {
  const projectPath = path.join(process.cwd(), args.projectName);
  if (args.force) {
    await fs.remove(projectPath);
  }

  if (fs.existsSync(projectPath)) {
    console.log(
      `\n Uh oh! Looks like there's already a directory called ${color.red(args.projectName)}\n`,
      `${color.yellow('Please try a different name or delete that folder.')}\n`,
      `Path: ${color.yellow(projectPath)}`
    );
    process.exit(1);
  }

  console.log('create', projectPath);
  console.log('args', args);
}