import path from 'path';
import execa from 'execa';
import { Arguments } from 'yargs';

/**
 * Get ext
 * @param {String} filePath `/a/b.jpg` => `jpg`
 */
export const getExt = (filePath: string) => path.extname(filePath).replace(/^\./, '').toLowerCase();

export interface IMyYargsArgs extends Arguments {
  projectName?: string; // create project
  'source-root'?: string;
  s?: string;
  sourceRoot?: string;
  force?: boolean;
  example?: string;
  'copy-files'?: boolean;
  copyFiles?: boolean;
  'source-maps'?: boolean | 'inline' | 'both' | 'none';
  sourceMaps?: boolean | 'inline' | 'both' | 'none';
  output?: string;
  o?: string;
  timer?: number;
  [key: string]: any;
}

export function completePath(args: IMyYargsArgs): IMyYargsArgs {
  args.sourceRoot = path.resolve(process.cwd(), args.sourceRoot || '');
  args.s = args.sourceRoot;
  args.output = path.resolve(process.cwd(), args.output || '');
  args.o = args.output;
  return args;
}

export function run(command: string, args: string[]) {
  if (!args) { [command, ...args] = command.split(/\s+/) }
  return execa(command, args, { cwd: this.context })
}