// tslint:disable:no-namespace
declare namespace jest {
  interface Matchers {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    toHaveStyleRule: import("@emotion/jest").jest.Matchers["toHaveStyleRule"];
  }
}
