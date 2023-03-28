import { abs } from './a/a';

export function sum(a: number, b: number) {
  return a + b + abs(a, b);
}
