export function help() {
  const pkg = require('../package.json');
  console.log();
  console.log(` Usage:\x1b[34;1m tsbb\x1b[0m <command>`);
  console.log(` Version ${pkg.version}`);
  console.log();

  console.log(' Commands:');
  console.log();
  console.log('  \x1b[35;1m tsbb\x1b[0m build [options]                Build your project once and exit.');
  console.log('  \x1b[35;1m tsbb\x1b[0m watch [options]                Recompile files on changes.');
  console.log('  \x1b[35;1m tsbb\x1b[0m test [options]                 Run jest test runner in watch mode.');
  console.log();
  console.log(` Examples:`);
  console.log();
  console.log(`   $\x1b[35;1m tsbb\x1b[0m build                         Build your project.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m build --entry src/index.ts    Specify the entry directory.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m build --esm ./es              Output directory.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m watch --disableBabelOption    Disable Babel Option.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m watch --cjs ./cjs             Watch Output directory.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m test                          Run test suites related`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m test --coverage               Test coverage information should be collected`);
  console.log();
  console.log(` Options:`);
  console.log();
  console.log('   --version, -v                      Show version number');
  console.log('   --help, -h                         Show help');
  console.log();
  console.log(' Copyright 2021');
  console.log();
}
