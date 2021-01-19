import { sum } from './utils/sum';

class Test {
  constructor() { }
  count() {
    return 10
  }
}

export default () => {
  const test = new Test()
  return sum(1, test.count());
};
