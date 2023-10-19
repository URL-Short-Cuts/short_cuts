import { CopyIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import mockUIHook from "../../../../hooks/tests/ui.mock.hook";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import HighLight from "../../../highlight/highlight.component";
import DimOnHover from "../../../styles/hover.dim/hover.dim.styles";
import generateBody, { TestIDs } from "../create.body.component";

jest.mock("../../../../hooks/ui", () => jest.fn(() => mockUIHook));

jest.mock("../../../styles/hover.dim/hover.dim.styles", () =>
  require("../../../../tests/fixtures/mock.component.children.factory.class").factoryInstance.create(
    "DimOnHover"
  )
);

jest.mock("../../../highlight/highlight.component", () =>
  require("../../../../tests/fixtures/mock.component.children.factory.class").factoryInstance.create(
    "HighLight"
  )
);

jest.mock("@chakra-ui/icons", () => ({
  CopyIcon: jest.fn(() => <div>MockIcon</div>),
}));

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Avatar", "Box", "Center", "Flex", "Text"]);
});

describe("AboutBody", () => {
  const mockUrl = "http://yahoo.com";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    const Body = generateBody(mockUrl);
    return render(<Body />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Center with the correct props", () => {
      expect(Center).toBeCalledTimes(1);
      checkMockCall(Center, {}, 0);
    });

    it("should call CopyIcon", () => {
      expect(CopyIcon).toBeCalledTimes(1);
      checkMockCall(CopyIcon, {
        cursor: "pointer",
        h: 7,
        w: 7,
        ml: 3,
        "data-testid": TestIDs.CreateUrlClipBoard,
      });
    });

    it("should call Box with the correct props", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(
        Box,
        {
          mb: 7,
        },
        0
      );
    });

    it("should call Center with the correct props", () => {
      expect(Center).toBeCalledTimes(1);
      checkMockCall(Center, {}, 0);
    });

    it("should call Flex with the correct props", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(
        Flex,
        {
          align: "center",
        },
        0
      );
    });

    it("should call HighLight with the correct props", () => {
      expect(HighLight).toBeCalledTimes(1);
      checkMockCall(HighLight, {
        p: 5,
      });
    });

    it("should call Text with the correct props", () => {
      expect(Text).toBeCalledTimes(1);
      checkMockCall(
        Text,
        {
          ml: 2,
          fontSize: ["xxs"],
        },
        0
      );
    });

    it("should call DimOnHover with the correct props", () => {
      expect(DimOnHover).toBeCalledTimes(1);
      checkMockCall(DimOnHover, {});
    });
  });
});
