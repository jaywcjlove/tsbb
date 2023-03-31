export const helpStr = (version: string = '') => `
Usage:\x1b[34;1m tsbb\x1b[0m <command>

 Commands:
 
  \x1b[35;1m tsbb\x1b[0m build [source…] [options]       Build your project once and exit.
  \x1b[35;1m tsbb\x1b[0m watch [source…] [options]       Recompile files on changes.
  \x1b[35;1m tsbb\x1b[0m test [options]        Run jest test runner in watch mode.

Options:[build|watch]

  \x1b[35;1m--bail\x1b[0m              Exit the compile as soon as the compile fails(default: true).
  \x1b[35;1m--use-babel\x1b[0m         Use Babel.(works in babel)
  \x1b[35;1m--source-maps\x1b[0m       Enables the generation of sourcemap files.(works in babel)
  \x1b[35;1m--env-name\x1b[0m          The current active environment used during configuration loading.(works in babel)
  \x1b[35;1m--esm\x1b[0m               Output "esm" directory.(works in babel)
  \x1b[35;1m--cjs\x1b[0m               Output "cjs" directory.(works in babel)

Options:

  \x1b[35;1m--version, -v\x1b[0m              Show version number
  \x1b[35;1m--help, -h\x1b[0m                 Show help

Examples:

  $\x1b[35;1m tsbb\x1b[0m build src/*.ts                                Build your project.
  $\x1b[35;1m tsbb\x1b[0m build src/main.ts src/good.ts                 Specify the entry directory.
  $\x1b[35;1m tsbb\x1b[0m build src/*.ts --use-babel --esm ./es         Output directory.
  $\x1b[35;1m tsbb\x1b[0m watch src/*.ts --use-babel --cjs ./cjs        Watch Output directory.
  $\x1b[35;1m tsbb\x1b[0m build src/*.ts --use-babel --use-vue          To add Vue JSX support.
  $\x1b[35;1m tsbb\x1b[0m build src/*.ts --use-babel --no-source-maps   No ".js.map" file is generated. (works in babel)
  $\x1b[35;1m tsbb\x1b[0m test                              Run test suites related
  $\x1b[35;1m tsbb\x1b[0m test --coverage --bail            Test coverage information should be collected

 Copyright 2023
`;
