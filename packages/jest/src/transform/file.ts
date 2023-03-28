import path from 'path';
// import camelcase from 'camelcase';
// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en/webpack.html

export default {
  process(sourceText: string, sourcePath: string, options: any) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`,
    };
  },
};
