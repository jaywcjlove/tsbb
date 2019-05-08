#!/usr/bin/env node

import yargs, { Argv, Arguments, Options } from 'yargs';
import color from 'colors-cli';
import buildProject from './build';
import watchProject from './watch';
import createProject from './create';
import { completePath, IMyYargsArgs } from '../utils';

interface IYargsOptions {
  [key: string]: Options;
}

const helpOption: IYargsOptions = {
  'help': {
    alias: 'h',
    describe: 'Show help.',
    type: 'boolean',
  },
}

const publicOptions: IYargsOptions = {
  'source-root': {
    alias: 's',
    describe: 'The root from which all sources are relative.',
    type: 'string',
    default: 'src',
  },
  'copy-files': {
    describe: 'When compiling a directory copy over non-compilable files.',
    type: 'boolean',
    default: true,
  },
  'source-maps': {
    describe: 'Source Map options.',
    type: 'string',
    default: true,
    choices: [true, 'inline', 'both', 'none'],
  },
  'output': {
    alias: 'o',
    describe: 'Output directory.',
    type: 'string',
    default: 'lib',
  },
  'comments': {
    describe: 'decide whether a given comment should be included in the output code.',
    type: 'boolean',
    default: true,
  }
}

const command = yargs
  .usage('Usage: $0 [options]')
  .command('create <project-name>', 'Create a new project with TSBB',
    (yarg: Argv) => 
      yarg.option({
        ...helpOption,
        'force': {
          alias: 'f',
          describe: 'force create.',
          type: 'boolean',
          default: false,
        },
        'example': {
          describe: 'Example from https://github.com/jaywcjlove/tsbb/tree/master/example example-path.',
          type: 'string',
          default: 'basic',
        }
      })
      .example('$ tsbb create my-app ', 'Create my project.')
      .example('$ tsbb create my-app --example express', 'Create an Express example project.'),
    (args: IMyYargsArgs) => {
      args = completePath(args);
      createProject(args);
    })

  .command('watch [options]', 'Recompile directory on changes.',
    (yarg: Argv) =>
      yarg.option({
        ...helpOption,
        ...publicOptions,
        'timer': {
          alias: 't',
          describe: 'Compile interval.',
          type: 'number',
          default: 300,
        },
      })
      .example('$ tsbb watch ', 'Rebuilds on any change.'),
    (args: Arguments) => {
      args = completePath(args);
      watchProject(args);
    })

  .command('build [options]', 'Build your project once and exit.',
    (yarg: Argv) =>
      yarg.option({
        ...helpOption,
        ...publicOptions,
      })
      .example('$ tsbb build ', 'Build your project.')
      .example('$ tsbb build --no-comments', 'Build your project and remove the comments.'),
    (args: IMyYargsArgs) => {
      args = completePath(args);
      buildProject(args);
    })

  .example(`\n$ ${color.green('tsdd build')}`, '\nBuild your project once and exit.')
  .example(`$ ${color.green('tsdd watch')}`, 'Rebuilds on any change.')
  .example(`$ ${color.green('tsdd watch --no-comments')}`, 'Rebuilds on any change.')
  .updateStrings({
    // 'Commands:': 'Commands:\n',
    // 'Options:': 'Options:\n',
  })
  .help()
  .locale('en')
  .epilog('Copyright 2019 \n')
  .argv;

if (command._.length === 0) {
  yargs.help().showHelp();
}
