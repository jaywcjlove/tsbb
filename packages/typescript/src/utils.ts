import ts from 'typescript';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Log } from './log.js';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

/**
 *
 * @param paths `[ 'src/index.jsx', 'test/sum.js' ]`
 * @returns ['src', 'test']
 */
export const getRootsFolderName = (paths: string[] = []) => paths.map((item) => item.split(path.sep)[0]);

const getLnCol = (text: string = '', pos: number = 0) => {
  const lines = text.split('\n');
  let lineNum = 1;
  let lineStartPos = 1;

  for (let i = 0; i < pos; i++) {
    if (text[i] === '\n') {
      lineNum++;
      lineStartPos = i + 1;
    }
  }
  return { ln: lineNum, col: lineStartPos, text: lines[lineNum - 1] };
};

export const getExt = (extname: string) => {
  let ext = path.extname(extname).toLocaleUpperCase().replace(/^\./, '');
  ext = ext.padEnd(4, ' ');
  if (/^MAP/.test(ext)) {
    return `\x1b[34;1m${ext}\x1b[0m`;
  }
  if (/^JS/.test(ext)) {
    return `\x1b[33;1m${ext}\x1b[0m`;
  }
  if (/^TS/.test(ext)) {
    return `\x1b[36;1m${ext}\x1b[0m`;
  }
  return ext;
};

export const getEmojiIcon = (fileName: string) => {
  let icon = /.d.ts$/i.test(fileName) ? '🐳' : '👉';
  icon = /.js.map$/i.test(fileName) ? '🚩' : icon;
  return icon;
};

export const writeFile = (fileName: string, data: string, writeByteOrderMark?: boolean) => {
  const outputFile = path.join(process.cwd(), fileName);
  ts.sys.writeFile(outputFile, data, writeByteOrderMark);
  const log = new Log();
  log
    .name()
    .icon(getEmojiIcon(fileName))
    .success(`${getExt(fileName)}┈┈▶ \x1b[32;1m${fileName}\x1b[0m`);
};

export const getSourceFile: ts.CompilerHost['getSourceFile'] = (fileName, languageVersion, onError) => {
  const contents = ts.sys.readFile(fileName, 'utf8');
  return ts.createSourceFile(fileName, contents || '', languageVersion);
};

export const reportDiagnostic = (diagnostic: ts.Diagnostic) => {
  const log = new Log();
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  const fileName = `\x1b[33;1m${diagnostic.file?.fileName}\x1b[0m`;
  const lnCol = getLnCol(diagnostic.file?.text, diagnostic.start);
  const codeText = lnCol.text ? `\n\n   Code:   \x1b[33;1m${lnCol.text}\x1b[0m` : '';
  log
    .name()
    .icon('🚨')
    .error(
      `┈┈▶ ${fileName} [Ln:${lnCol.ln} Col:${lnCol.col}]`,
      codeText,
      `\n   Error: ${diagnostic.code} \x1b[31;1m${message}\x1b[0m`,
    );
};

export const onWatchStatusChange = (
  diagnostic: ts.Diagnostic,
  newLine: string,
  options: ts.CompilerOptions,
  errorCount?: number,
) => {
  const log = new Log();
  if (typeof errorCount !== 'number') {
    log.name().icon('🔆').success(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    return;
  }
  if (errorCount) {
    if (!diagnostic.file?.fileName) {
      return;
    }
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    const lnCol = getLnCol(diagnostic.file?.text, diagnostic.start);
    const fileName = `\x1b[33;1m${diagnostic.file?.fileName}\x1b[0m`;
    const codeText = lnCol.text ? `\n\n   Code:   \x1b[33;1m${lnCol.text}\x1b[0m` : '';
    log
      .name()
      .icon('🚨')
      .error(
        `┈┈▶ ${fileName} [Ln:${lnCol.ln} Col:${lnCol.col}]`,
        codeText,
        `\n   Error: ${diagnostic.code} \x1b[31;1m${message}\x1b[0m\n`,
      );
  } else {
    if (!options.emitDeclarationOnly) {
      log.name().icon('🎉').success(diagnostic.messageText);
    }
  }
};

/**
 * @param sourceFilePath `src/demo/index.ts`
 * @param rootDirsRelative `['src', 'test']`
 * @returns `demo/index.ts`
 */
export const getSourceFilePath = (sourceFilePath: string, rootDirsRelative: string[]) => {
  const rootDirsAbsolutePath = rootDirsRelative.map((dir) => path.resolve(dir));
  const sourceFileAbsolutePath = path.resolve(sourceFilePath);
  let finalPath = sourceFileAbsolutePath;
  for (const rootDir of rootDirsAbsolutePath) {
    if (sourceFileAbsolutePath.startsWith(rootDir)) {
      finalPath = sourceFileAbsolutePath.slice(rootDir.length + 1);
      break;
    }
  }
  return finalPath;
};
