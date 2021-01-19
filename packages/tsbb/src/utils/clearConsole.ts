// Taken from Create React App, react-dev-utils/clearConsole
// @see https://github.com/facebook/create-react-app/blob/e41c67dfce6ec45966d7c3d2701120c4d98446a6/packages/react-dev-utils/clearConsole.js
// @see https://en.wikipedia.org/wiki/ANSI_escape_code#Windows
export function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

export function clearScreenConsole(str?: string) {
  process.stdout.write(`\x1b[?6h\x1b[2J${str || ''}`);
}
