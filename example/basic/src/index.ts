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

export default async () => {
  const test = new Test();
  await testHandle();
  return sum(1, test.count());
};
