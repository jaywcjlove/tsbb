#!/usr/bin/env node

import yargs, { Argv, Arguments } from 'yargs';
import color from 'colors-cli';
import buildProject from './build';
import watchProject from './watch';
import { completePath, ICompletePathArgs } from '../utils';

const command = yargs
  .usage('Usage: $0 [options]')
  .option('help', {
    alias: 'h',
    describe: 'Show help.',
    type: 'boolean',
  })
  .option('source-root', {
    alias: 's',
    describe: 'The root from which all sources are relative.',
    type: 'string',
    default: 'src',
  })
  .option('copy-files', {
    describe: 'When compiling a directory copy over non-compilable files.',
    type: 'boolean',
    default: true,
  })
  .option('source-maps', { describe: 'Source Map options.', type: 'string', default: true })
  .choices('source-maps', [true, false, 'inline', 'both'])
  .option('output', {
    alias: 'o',
    describe: 'Output directory.',
    type: 'string',
    default: 'lib',
  })
  .command('watch', 'Recompile directory on changes.',
    (yarg: Argv) =>
      yarg.option('timer', {
        alias: 't',
        describe: 'Compile interval.',
        type: 'number',
        default: 300,
      })
      .option('comments', {
        describe: 'decide whether a given comment should be included in the output code.',
        type: 'boolean',
        default: true,
      })
      .example('$ tsbb watch ', 'Rebuilds on any change.'),
    (args: Arguments) => {
      args = completePath(args);
      watchProject(args);
    })

  .command('build', 'Build your project once and exit.',
    (yarg: Argv) => 
      yarg.option('comments', {
        describe: 'decide whether a given comment should be included in the output code.',
        type: 'boolean',
        default: false,
      })
      .example('$ tsbb build ', 'Build your project.'),
    (args: ICompletePathArgs) => {
      args = completePath(args);
      buildProject(args);
    })

  .example(`\n$ ${color.green('tsdd build')}`, '\nBuild your project once and exit.')
  .example(`$ ${color.green('tsdd watch')}`, 'Rebuilds on any change.')
  .example(`$ ${color.green('tsdd watch --no-comments')}`, 'Rebuilds on any change.')
  .help()
  .locale('en')
  .epilog('Copyright 2019 \n')
  .argv;

if (command._.length === 0) {
  yargs.help().showHelp();
}
