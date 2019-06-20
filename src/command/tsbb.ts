#!/usr/bin/env node

import yargs from 'yargs';
import color from 'colors-cli';

const command = yargs
  .usage('Usage: $0 [options]')
  .command(require('./create'))
  .command(require('../build'))
  .command(require('../build/watch'))
  .command(require('../types'))
  .command(require('./test'))
  .example(`\n$ ${color.green('tsbb build')}`, '\nBuild your project once and exit.')
  .example(`$ ${color.green('tsbb watch')}`, 'Rebuilds on any change.')
  .example(`$ ${color.green('tsbb test')}`, 'Run test suites related.')
  .example(`$ ${color.green('tsbb test --coverage')}`, 'Test coverage information should be collected')
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
