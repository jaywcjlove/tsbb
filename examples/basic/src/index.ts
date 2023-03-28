import { sum } from './utils/sum';
import { test } from './utils/Test';

class Test {
  constructor() {}
  public a: string = 'A';
  count() {
    return 10;
  }
}

(() => {
  const { sum } = require('./utils/sum');
  const data = { a: 1 };
  const result = { ...data };
})();

export default async () => {
  const testHandle = new Test();
  return `${sum(1, testHandle.count())} ${test('Hello World')}`;
};
