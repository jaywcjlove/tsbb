import path from 'path';
import fs from 'fs-extra';

export async function getFiles(exampleDir: string, paths: string[] = []) {
  let filesName = await fs.readdir(exampleDir);
  filesName = filesName.map((name) => {
    return path.join(exampleDir, name);
  });
  await Promise.all(
    filesName.map(async (filePath: string) => {
      const info = await fs.stat(filePath);
      if (info.isFile()) {
        paths.push(filePath);
      } else if (info.isDirectory()) {
        const dirFils = await getFiles(filePath, []);
        paths = paths.concat(dirFils);
      }
      return filePath;
    }),
  );
  return paths;
}

export async function moverDir(exampleDir: string, projectPath: string) {
  const files = await getFiles(exampleDir);
  return Promise.all(
    files.map(async (filePath: string) => {
      const copyToPath = filePath.replace(exampleDir, projectPath);
      await fs.copy(filePath, copyToPath);
      return copyToPath;
    }),
  );
}
