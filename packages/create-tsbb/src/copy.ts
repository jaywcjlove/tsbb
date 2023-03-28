import path from 'node:path';
import cpy from 'cpy';
import fs from 'fs-extra';
import { TEMPLATE, __dirname } from './index.js';

async function renamePkg(pathStr: string, name: string) {
  const pkgPath = path.resolve(__dirname, pathStr);
  const pkg = await fs.readJSON(pkgPath);
  pkg.name = name;
  await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
  await fs.rename(pkgPath, path.resolve(path.dirname(pkgPath), '_package.json'));
}

function rename(basename: string) {
  if (basename === '.npmrc') return `_${basename}`;
  if (basename === '.gitignore') return `_${basename}`;
  if (basename === '.babelrc') return `_${basename}`;
  if (basename === '.prettierignore') return `_${basename}`;
  if (basename === '.prettierrc') return `_${basename}`;
  if (basename === '.parcelrc') return `_${basename}`;
  if (basename === 'tsconfig') return `_${basename}`;
  return basename;
}

async function copyProject(name: string) {
  await fs.emptyDir('dist');
  await cpy(`../../examples/${name}`, './dist', {
    rename,
    filter: (file) =>
      !new RegExp(`${name}[\\/](node_modules|__snapshots__|build|dist|coverage|lib|cjs|esm|)[\\/]`).test(file.path) &&
      !/__snapshots__/.test(file.path),
  });
  await renamePkg(`../dist/${name}/package.json`, name);
  console.log(`👉\x1b[32m ${name}\x1b[0m template`);
}

(async () => {
  try {
    await fs.emptyDir(path.resolve(__dirname, '../dist'));
    Promise.all(TEMPLATE.map(async (name) => copyProject(name)));
  } catch (error) {
    console.log('ERROR:', error);
  }
})();
