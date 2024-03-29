import { ChakraProvider, CSSReset, ColorModeProvider } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import UserInterfaceProvider from "../ui.chakra.provider";
import createTheme from "../ui.chakra.theme";
import type { ReactNode } from "react";

jest.mock("@chakra-ui/react", () => {
  const mockedModules: { [index: string]: boolean | jest.Mock } = {
    __esModule: true,
  };

  const providers = {
    ChakraProvider: "ChakraProvider",
    ColorModeProvider: "ColorModeProvider",
    CSSReset: "CSSReset",
  };

  const createMock = (name: string) =>
    jest.fn(({ children }: { children: ReactNode }) => {
      return <div data-testid={name}>{children}</div>;
    });

  Object.keys(providers).forEach((thisModule) => {
    mockedModules[thisModule as string] = createMock(thisModule);
  });
  return mockedModules;
});

jest.mock("../ui.chakra.theme", () => {
  const chakra = jest.requireActual("@chakra-ui/react");
  return jest.fn().mockImplementation(() => chakra.extendTheme({}));
});

describe("UserInterfaceChakraProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async () => {
    render(
      <UserInterfaceProvider>
        <div data-testid={"UserInterfaceProvider"}>Test</div>
      </UserInterfaceProvider>
    );
  };

  describe("When Rendered", () => {
    it("should call createTheme", () => {
      arrange();
      expect(createTheme).toBeCalledTimes(1);
      expect(createTheme).toBeCalledWith();
    });

    it("should initialize the ChakraProvider Provider", () => {
      arrange();
      expect(ChakraProvider).toBeCalledTimes(1);
      checkMockCall(ChakraProvider, { theme: createTheme() });
    });

    it("should initialize the CSSReset", () => {
      arrange();
      expect(CSSReset).toBeCalledTimes(1);
      checkMockCall(CSSReset, {});
    });

    it("should initialize the ColorModeProvider", () => {
      arrange();
      expect(ColorModeProvider).toBeCalledTimes(1);
      checkMockCall(ColorModeProvider, {
        options: {
          useSystemColorMode: false,
          initialColorMode: "dark",
        },
      });
    });
  });
});
