import { getExt } from '../../src/utils';

describe('utils test case', () => {
  it('getExt', () => {
    expect(getExt('/git/tsbb/koa.ts')).toBe('ts');
    expect(getExt('/git/tsbb/koa')).toBe('');
    expect(getExt('/git/tsbb/')).toBe('');
  });
});
