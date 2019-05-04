
/**
 * Get ext
 * @param {String} filePath `/a/b.jpg` => `jpg`
 */
export const getExt = (filePath: string) => filePath.replace(/^.*[\.\/\\]/, "").toLowerCase();
