// Tipagem mínima para rodar os testes com o runner nativo do Node 20
// (`node --test`) sem adicionar @types/node ao SDK.
declare module 'node:test' {
  type TestFn = (t: { diagnostic(msg: string): void }) => void | Promise<void>;
  export function test(name: string, fn: TestFn): void;
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: TestFn): void;
}
declare module 'node:assert/strict' {
  interface Assert {
    (value: unknown, message?: string): asserts value;
    equal(actual: unknown, expected: unknown, message?: string): void;
    notEqual(actual: unknown, expected: unknown, message?: string): void;
    deepEqual(actual: unknown, expected: unknown, message?: string): void;
    ok(value: unknown, message?: string): asserts value;
    match(value: string, re: RegExp, message?: string): void;
  }
  const assert: Assert;
  export default assert;
}
