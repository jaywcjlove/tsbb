import fs from 'fs';
import path from 'path';
import { transformSync } from '@babel/core';
import addImportExtension from '@uiw/babel-plugin-add-import-extension';
import renameImport from 'babel-plugin-transform-rename-import';
import dottedFilenameExtension, {
  appendJsToDottedFilename,
} from '../packages/babel/src/dotted-filename-extension';

const plugin = (mod: unknown) => {
  const value = mod as { default?: unknown };
  return typeof value?.default === 'function' ? value.default : mod;
};

const source = `
import editor from './Editor.nohighlight';
import { createMDEditor } from './Editor.factory';
import TextArea from './components/TextArea/index.common';
import Markdown from './Markdown.common';
import cn from './commands/index.cn';
export * from './Editor.nohighlight';
export { createMDEditor as create } from './Editor.factory';
import png from './logo.png';
import photo from './avatar.jpeg';
import styles from './index.less';
import theme from './theme.module.less';
import local from './local';
import react from 'react';
import preview from '@uiw/react-markdown-preview/nohighlight';
import fs from 'node:fs';
const lazy = import('./Editor.factory');
const asset = import('./logo.png?inline');
`;

it('appends .js to relative imports whose dot is part of the filename', () => {
  expect(appendJsToDottedFilename('./Editor.nohighlight')).toBe('./Editor.nohighlight.js');
  expect(appendJsToDottedFilename('./commands/index.cn')).toBe('./commands/index.cn.js');
  expect(appendJsToDottedFilename('./logo.png')).toBe('./logo.png');
  expect(appendJsToDottedFilename('./index.less')).toBe('./index.less');
  expect(appendJsToDottedFilename('./local')).toBe('./local');
  expect(appendJsToDottedFilename('./local.js')).toBe('./local.js');
  expect(appendJsToDottedFilename('./commands/')).toBe('./commands/');
  expect(appendJsToDottedFilename('@uiw/react-markdown-preview/nohighlight')).toBe(
    '@uiw/react-markdown-preview/nohighlight',
  );
  expect(appendJsToDottedFilename('./logo.png?inline')).toBe('./logo.png?inline');
});

it('keeps asset imports and adds .js after the extension plugin skips dotted filenames', () => {
  const result = transformSync(source, {
    babelrc: false,
    configFile: false,
    filename: 'fixture.ts',
    plugins: [
      [
        plugin(addImportExtension),
        {
          extension: 'js',
          skipUnlistedExtensions: true,
        },
      ],
      plugin(dottedFilenameExtension),
      [
        plugin(renameImport),
        {
          original: '^(.+?)\\.(less|scss|sass|styl)$',
          replacement: '$1.css',
        },
      ],
    ],
  });
  const code = (result?.code || '').replaceAll('"', "'");
  expect(code).toContain(`from './Editor.nohighlight.js'`);
  expect(code).toContain(`from './Editor.factory.js'`);
  expect(code).toContain(`from './components/TextArea/index.common.js'`);
  expect(code).toContain(`from './Markdown.common.js'`);
  expect(code).toContain(`from './commands/index.cn.js'`);
  expect(code).toContain(`from './logo.png'`);
  expect(code).toContain(`from './avatar.jpeg'`);
  expect(code).toContain(`from './index.css'`);
  expect(code).toContain(`from './theme.module.css'`);
  expect(code).toContain(`from './local.js'`);
  expect(code).toContain(`from 'react'`);
  expect(code).toContain(`from '@uiw/react-markdown-preview/nohighlight'`);
  expect(code).toContain(`from 'node:fs'`);
  expect(code).toContain(`import('./Editor.factory.js')`);
  expect(code).toContain(`import('./logo.png?inline')`);
  expect(code).not.toContain(`'./Editor.nohighlight'`);
  expect(code).not.toContain(`'./index.less'`);
});

it('registers the dotted-filename plugin between extension rewrite and style rename', () => {
  const config = fs.readFileSync(path.resolve(process.cwd(), 'packages/babel/src/config.ts'), 'utf8');
  const esm = config.slice(config.indexOf('export const getESMTransformOption'));
  const extensionPlugin = esm.indexOf('babelPluginAddImportExtension.default');
  const dottedPlugin = esm.indexOf('dottedFilenameExtension');
  const renamePlugin = esm.indexOf('babelPluginTransformRenameImport.default');
  expect(extensionPlugin).toBeGreaterThan(-1);
  expect(dottedPlugin).toBeGreaterThan(extensionPlugin);
  expect(renamePlugin).toBeGreaterThan(dottedPlugin);
});
