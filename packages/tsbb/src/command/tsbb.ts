#!/usr/bin/env node

import yargs from 'yargs';

(async () => {
  const argv = await yargs(process.argv.slice(2))
    .usage('Usage: $0 [options]')
    .command(require('./create'))
    .command(require('../build'))
    .command(require('../build/watch'))
    .command(require('../types'))
    .command(require('./test'))
    .example(`\n$\x1b[1;32m tsbb build\x1b[0m`, '\nBuild your project once and exit.')
    .example(`$\x1b[1;32m tsbb watch\x1b[0m`, 'Rebuilds on any change.')
    .example(`$\x1b[1;32m tsbb test\x1b[0m`, 'Run test suites related.')
    .example(`$\x1b[1;32m tsbb test --coverage\x1b[0m`, 'Test coverage information should be collected')
    .updateStrings({
      // 'Commands:': 'Commands:\n',
      // 'Options:': 'Options:\n',
    })
    .help()
    .locale('en')
    .epilog('Copyright 2019 \n').argv;

  if (argv._.length === 0) {
    yargs.help().showHelp();
  }
})();
