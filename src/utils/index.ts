import path from 'path';
import { Arguments } from 'yargs';

/**
 * Get ext
 * @param {String} filePath `/a/b.jpg` => `jpg`
 */
export const getExt = (filePath: string) => filePath.replace(/^.*[\.\/\\]/, "").toLowerCase();

export interface ICompletePathArgs extends Arguments {
  'source-root'?: string;
  s?: string;
  sourceRoot?: string;
  'copy-files'?: boolean;
  copyFiles?: boolean;
  'source-maps'?: boolean | 'inline' | 'both';
  sourceMaps?: boolean | 'inline' | 'both';
  output?: string;
  o?: string;
  timer?: number;
  [key: string]: any;
}

export function completePath(args: ICompletePathArgs): ICompletePathArgs {
  args.sourceRoot = path.resolve(process.cwd(), args.sourceRoot || '');
  args.s = args.sourceRoot;
  args.output = path.resolve(process.cwd(), args.output || '');
  args.o = args.output;
  return args;
}