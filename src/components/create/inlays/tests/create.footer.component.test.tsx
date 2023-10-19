import { Flex } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import translations from "../../../../../public/locales/en/create.json";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import mockRouter from "../../../../tests/fixtures/mock.router";
import tLookup from "../../../../tests/fixtures/mock.translation";
import Button from "../../../button/button.standard/button.standard.component";
import Footer from "../create.footer.component";
import type { TFunction } from "../../../../types/translations/hook.types";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: () => mockRouter,
}));

jest.mock("../../../button/button.standard/button.standard.component", () =>
  require("../../../../tests/fixtures/mock.component.children.factory.class").factoryInstance.create(
    "Button"
  )
);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Flex"]);
});

describe("About", () => {
  const mockT = jest.fn((key) => tLookup(key, translations)) as TFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<Footer t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Flex with the correct props", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(Flex, {}, 0);
    });

    it("should call Button with the correct props", () => {
      expect(Button).toBeCalledTimes(1);
      checkMockCall(
        Button,
        {
          analyticsName: "Create Another",
          mb: 2,
          ml: 2,
          w: "150px",
        },
        0
      );
    });
  });
});
