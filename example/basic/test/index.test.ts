/// <reference types="jest" />

import { sum } from '../src/utils/sum';

describe('sum', () => {
  it('works', async () => {
    expect(sum(1, 1)).toEqual(2);
  });
});
