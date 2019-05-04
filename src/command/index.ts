import yargs, { Argv } from 'yargs';
import color from 'colors-cli';
import buildProject  from './build';

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
  .option('output', {
    alias: 'o',
    describe: 'Output directory.',
    type: 'string',
    default: 'lib',
  })
  .command('watch', 'Rebuilds on any change.',
    (yarg: Argv) =>
      yarg.example('$ tsbb watch ', 'Rebuilds on any change.'),
    buildProject)

  .command('build', 'Build your project once and exit.',
    (yarg: Argv) => 
      yarg.example('$ tsbb build ', 'Build your project.'),
    buildProject)

  .example(`\n$ ${color.green('tsdd build')}`, '\nBuild your project once and exit.')
  .example(`$ ${color.green('tsdd watch')}`, 'Rebuilds on any change.')
  .help()
  .locale('en')
  .epilog('Copyright 2019 \n')
  .argv;

if (command._.length === 0) {
  yargs.help().showHelp();
}
