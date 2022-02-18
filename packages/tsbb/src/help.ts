export function help() {
  const pkg = require('../package.json');
  console.log();
  console.log(` Usage:\x1b[34;1m tsbb\x1b[0m <command>`);
  console.log(` Version ${pkg.version}`);
  console.log();
  console.log(' Commands:');
  console.log();
  console.log('  \x1b[35;1m tsbb\x1b[0m build [options]       Build your project once and exit.');
  console.log('  \x1b[35;1m tsbb\x1b[0m watch [options]       Recompile files on changes.');
  console.log('  \x1b[35;1m tsbb\x1b[0m test [options]        Run jest test runner in watch mode.');
  console.log();
  console.log(` Options:[build|watch]`);
  console.log();
  console.log(`   \x1b[35;1m--entry, -e\x1b[0m                Specify the entry directory.`);
  console.log(
    `   \x1b[35;1m--env-name\x1b[0m                 The current active environment used during configuration loading.`,
  );
  console.log(`   \x1b[35;1m--emit-type\x1b[0m                Emit d.ts type files.`);
  console.log(`   \x1b[35;1m--no-emit-type\x1b[0m             No emit d.ts type files.`);
  console.log(`   \x1b[35;1m--disable-babel\x1b[0m            Disable Babel.`);
  console.log(`   \x1b[35;1m--no-babel-option\x1b[0m          Disable Babel Option.`);
  console.log(`   \x1b[35;1m--file-names, -f\x1b[0m           A set of root files.`);
  console.log(`   \x1b[35;1m--esm\x1b[0m                      Output "esm" directory.`);
  console.log(`   \x1b[35;1m--cjs\x1b[0m                      Output "cjs" directory.`);
  console.log();
  console.log(` Options:`);
  console.log();
  console.log('   \x1b[35;1m--version, -v\x1b[0m              Show version number');
  console.log('   \x1b[35;1m--help, -h\x1b[0m                 Show help');
  console.log();
  console.log(` Examples:`);
  console.log();
  console.log(`   $\x1b[35;1m tsbb\x1b[0m build                           Build your project.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m build --entry src/index.ts      Specify the entry directory.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m build --esm ./es                Output directory.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m build --use-vue                 To add Vue JSX support.`);
  console.log(
    `   $\x1b[35;1m tsbb\x1b[0m build --no-source-maps          No ".js.map" file is generated. (Can't disable babel)`,
  );
  console.log(`   $\x1b[35;1m tsbb\x1b[0m watch --disable-babel           Disable Babel.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m watch --no-emit-type            No emit d.ts type files.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m watch --no-babel-option         Disable Babel Option.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m watch --babel-option '{\"presets\": [\"@babel/preset-typescript\"] }'`);
  console.log(`                                          Babel Option.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m watch --cjs ./cjs               Watch Output directory.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m build --disable-babel --file-names src/index.ts --file-names src/main.ts`);
  console.log(`                                          A set of root files.`);
  console.log(`   $\x1b[35;1m tsbb\x1b[0m test                            Run test suites related`);
  console.log(
    `   $\x1b[35;1m tsbb\x1b[0m test --coverage                 Test coverage information should be collected`,
  );
  console.log();
  console.log(' Copyright 2022');
  console.log();
}
