/// <reference types="jest" />

import index from './';

describe('sum', () => {
  it('works', () => {
    expect(index()).toBe(11);
  });
});
