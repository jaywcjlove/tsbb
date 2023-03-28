export const helpStr = () => `
  Usage: \x1b[35mcreate-tsbb\x1b[0m <app-name> [options] [--help|h]
  Options:

    --version, -v  Show version number
    --help, -h     Displays help information.
    --force, -f    Overwrite folder contents.
    --example, -e  Example: \x1b[34;1m"npm create tsbb my-app -e typenexus"\x1b[0m,
                   default: \x1b[33m"basic"\x1b[0m

  Example:
  ${exampleStr}
  Copyright 2023
`;

export const exampleStr = `
    $ \x1b[35myarn\x1b[0m create tsbb \x1b[33mappName\x1b[0m
    $ \x1b[35mnpx\x1b[0m create-tsbb \x1b[33mmy-app\x1b[0m
    $ \x1b[35mnpm\x1b[0m create tsbb \x1b[33mmy-app\x1b[0m
    $ \x1b[35mnpm\x1b[0m create tsbb@latest \x1b[33mmy-app\x1b[0m
    \x1b[30;1m# npm 7+, extra double-dash is needed:\x1b[0m
    $ \x1b[35mnpm\x1b[0m create tsbb \x1b[33mmy-app\x1b[0m \x1b[32;1m--\x1b[0m -f
    $ \x1b[35mnpm\x1b[0m create tsbb \x1b[33mmy-app\x1b[0m \x1b[32;1m--\x1b[0m -e \x1b[34;1mtypenexus\x1b[0m
`;
