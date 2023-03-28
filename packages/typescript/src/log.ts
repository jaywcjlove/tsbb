import ts from 'typescript';
import fs from 'fs-extra';
import path from 'node:path';

export class Log {
  private data: string[] = [];
  private iconStr: string = '';
  constructor() {}
  /** show project name */
  name() {
    const dir = ts.sys.getCurrentDirectory();
    const pkgPath = path.resolve(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = fs.readJSONSync(pkgPath);
      if (pkg.name) {
        this.data.unshift(`\x1b[35m${pkg.name}\x1b[0m`);
      }
    } else {
      this.data.unshift(`\x1b[35m${path.basename(dir)}\x1b[0m`);
    }
    return this;
  }
  icon(str: string) {
    this.iconStr = str;
    return this;
  }
  error(message?: any, ...optionalParams: any[]) {
    console.error(...[this.iconStr, ...this.data, message, ...optionalParams]);
    return this;
  }
  success(message?: any, ...optionalParams: any[]) {
    console.info(...[this.iconStr, ...this.data, message, ...optionalParams]);
    return this;
  }
}
