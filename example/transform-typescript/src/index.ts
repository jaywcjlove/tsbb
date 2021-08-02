import { sum } from './utils/sum';

class Test {
  constructor() {}
  count() {
    return 10;
  }
}

async function testHandle() {
  console.log('>>>');
}

(() => {
  const { sum } = require('./utils/sum');
  const data = { a: 1 };
  const result = { ...data };
  console.log('>>>', sum(1, result.a));
})();

export default async () => {
  const test = new Test();
  await testHandle();
  return sum(1, test.count());
};
