/// <reference types="jest" />

import index from './';

describe('sum', () => {
  it('works', async () => {
    const num = await index();
    expect(num).toBe(11);
  });
});
