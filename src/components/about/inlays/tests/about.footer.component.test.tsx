import { Flex } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import translations from "../../../../../public/locales/en/about.json";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import tLookup from "../../../../tests/fixtures/mock.translation";
import Button from "../../../button/button.standard/button.standard.component";
import Footer from "../about.footer.component";
import type { TFunction } from "../../../../types/translations/hook.types";

jest.mock("next/router", () => jest.requireActual("next-router-mock"));

jest.mock("../../../button/button.standard/button.standard.component", () =>
  require("../../../../tests/fixtures/mock.component.children.factory.class").factoryInstance.create(
    "Button"
  )
);

jest.mock("../../../icons/svs/svs.icon", () =>
  jest.fn(() => <div>MockIcon</div>)
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
      expect(Button).toBeCalledTimes(2);
      checkMockCall(
        Button,
        {
          analyticsName: "About Page Privacy Policy",
          mb: 2,
          mr: 2,
          w: "125px",
        },
        0
      );
      checkMockCall(
        Button,
        {
          analyticsName: "About Page Start",
          mb: 2,
          ml: 2,
          w: "125px",
        },
        1
      );
    });
  });
});
