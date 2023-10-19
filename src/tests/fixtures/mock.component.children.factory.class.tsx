import type { ReactNode } from "react";

class MockComponentWithChildrenFactory {
  create = (name: string, exportName = "default") => {
    const mockModule: { [index: string]: jest.Mock | string | boolean } = {
      __esModule: true,
    };
    mockModule[exportName] = jest.fn(
      ({ children }: { children: ReactNode }) => {
        return <div data-testid={name}>{children}</div>;
      }
    );
    return mockModule;
  };
}

export const factoryInstance = new MockComponentWithChildrenFactory();
