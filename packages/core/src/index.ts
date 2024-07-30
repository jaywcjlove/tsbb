import meow, { TypedFlags } from 'meow';
import type { CamelCase } from 'type-fest';
import { glob } from 'glob';
import jest, { JestOptions } from '@tsbb/jest';
import { Log } from '@tsbb/typescript';
import { helpStr } from './helpStr.js';
import { compile, type CompileOptions } from './compile.js';
import { copy, type CopyOption } from './copy.js';

export * from './watcher/copyFiles.js';

export async function tsbb() {
  const cli = meow(helpStr(), {
    importMeta: import.meta,
    flags: {
      useBabel: {
        type: 'boolean',
        shortFlag: 'b',
        default: false,
      },
      sourceMaps: {
        default: false,
      },
      bail: {
        type: 'boolean',
        default: true,
      },
    },
  });
  const flags: CamelCase<TypedFlags<CompileOptions>> & Record<string, unknown> = cli.flags;
  const log = new Log();
  if (flags.h || flags.help) {
    cli.showHelp();
    process.exitCode = 0;
  }
  if (flags.v || flags.version) {
    cli.showVersion();
    process.exitCode = 0;
  }
  try {
    if (cli.input.length === 0) {
      throw new Error('Please enter command parameters, such as: (build, watch, copy)');
    }
    let entry = [...cli.input];
    entry.shift();

    const commandName = cli.input[0];
    entry = await glob(entry, /^(copy|cpy)/i.test(commandName) ? {} : { ignore: 'node_modules/**' });

    if (commandName === 'build') {
      compile({ ...flags, build: true, entry } as CompileOptions);
    } else if (/^(copy|cpy)/i.test(commandName)) {
      copy({ ...flags, entry } as CopyOption);
    } else if (/^(watch|start|dev)/i.test(commandName)) {
      compile({ ...flags, watch: true, entry } as CompileOptions);
    } else if (/^(test)/i.test(commandName)) {
      jest(flags as unknown as JestOptions);
    } else {
      console.error('\n  \x1b[31;1m The build/watch/jest parameter must be passed in\x1b[0m\n');
      process.exitCode = 1;
    }
  } catch (error) {
    if (error instanceof Error) {
      log.name().icon('🚨').success(`\x1b[31;1m${error.message}\x1b[0m\n`, error.stack);
    } else {
      log
        .name()
        .icon('🚨')
        .success(`\x1b[31;1m${JSON.stringify(error)}\x1b[0m\n`);
    }
    process.exitCode = 1;
  }
}
