export type Test = {
  a: string;
  b: number;
};

export type TestGood = {
  a: string;
  g: string;
  b: number;
  c: number;
  e: number;
  e333: number;
};

export function test(str: string) {
  return `${str}`;
}
