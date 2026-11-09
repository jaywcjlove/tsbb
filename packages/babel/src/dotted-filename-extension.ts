import path from 'node:path';
import type { NodePath, PluginObj } from '@babel/core';

/**
 * Extensions that are real file types. `path.extname('./Editor.nohighlight')`
 * is `.nohighlight`, which is part of the module name, not one of these.
 */
const PRESERVED_EXTENSIONS = new Set([
  '.js',
  '.mjs',
  '.cjs',
  '.jsx',
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.json',
  '.css',
  '.less',
  '.scss',
  '.sass',
  '.styl',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.avif',
  '.ico',
  '.bmp',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.otf',
  '.mp3',
  '.mp4',
  '.webm',
  '.wav',
  '.ogg',
  '.wasm',
  '.map',
  '.html',
  '.txt',
  '.md',
]);

interface StringLiteral {
  type: 'StringLiteral';
  value: string;
}

function isStringLiteral(node: { type: string } | null | undefined): node is StringLiteral {
  return !!node && node.type === 'StringLiteral';
}

/**
 * Append `.js` to a relative specifier whose last dot is not a real extension.
 * `./Editor.nohighlight` becomes `./Editor.nohighlight.js`. `./logo.png` stays.
 * Extensionless specifiers are left for `@uiw/babel-plugin-add-import-extension`,
 * which also rewrites directory imports such as `./commands/` to `./commands/index.js`.
 */
export function appendJsToDottedFilename(specifier: string): string {
  if (!specifier.startsWith('.')) return specifier;
  const queryAt = specifier.search(/[?#]/);
  const pathname = queryAt === -1 ? specifier : specifier.slice(0, queryAt);
  const suffix = queryAt === -1 ? '' : specifier.slice(queryAt);
  const ext = path.posix.extname(pathname).toLowerCase();
  if (!ext || PRESERVED_EXTENSIONS.has(ext)) return specifier;
  return `${pathname}.js${suffix}`;
}

function rewrite(source: { type: string } | null | undefined) {
  if (!isStringLiteral(source)) return;
  const next = appendJsToDottedFilename(source.value);
  if (next !== source.value) source.value = next;
}

interface SourceNode {
  source?: { type: string } | null;
}

interface ImportCallNode {
  callee?: { type: string } | null;
  arguments?: Array<{ type: string } | null | undefined>;
}

export default function dottedFilenameExtension(): PluginObj {
  return {
    name: 'tsbb-dotted-filename-extension',
    visitor: {
      ImportDeclaration(importPath: NodePath) {
        rewrite((importPath.node as SourceNode).source);
      },
      ExportNamedDeclaration(exportPath: NodePath) {
        rewrite((exportPath.node as SourceNode).source);
      },
      ExportAllDeclaration(exportPath: NodePath) {
        rewrite((exportPath.node as SourceNode).source);
      },
      CallExpression(callPath: NodePath) {
        const node = callPath.node as ImportCallNode;
        if (node.callee?.type !== 'Import') return;
        rewrite(node.arguments?.[0]);
      },
    },
  };
}
