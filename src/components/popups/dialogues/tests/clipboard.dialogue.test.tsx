import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import mockColourHook from "../../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import DimOnHover from "../../../styles/hover.dim/hover.dim.styles";
import ClipBoardDialogue, { testIDs } from "../clipboard.dialogue";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  const instance = factoryInstance.create(["Box", "Flex", "Text"]);
  return instance;
});

jest.mock("@chakra-ui/icons", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.icon.factory.class");
  const instance = factoryInstance.create(["CloseIcon"]);
  return instance;
});

jest.mock("../../../../hooks/colour", () => {
  return () => mockColourHook;
});

jest.mock("../../../styles/hover.dim/hover.dim.styles", () =>
  createMockedComponent("DimOnHover")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("ClipBoardDialogue", () => {
  const mockClose = jest.fn();
  const mockMessage = "mockMessage";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<ClipBoardDialogue message={mockMessage} onClose={mockClose} />);
  };

  it("should call the Box component correctly", () => {
    expect(Box).toBeCalledTimes(1);
    checkMockCall(Box, {
      mb: [5, 5, 8],
      bg: mockColourHook.notificationColour.background,
      color: mockColourHook.notificationColour.foreground,
      borderColor: mockColourHook.notificationColour.border,
      borderWidth: 1,
      borderRadius: 20,
    });
  });

  it("should call the CloseIcon component correctly", () => {
    expect(CloseIcon).toBeCalledTimes(1);
    checkMockCall(
      CloseIcon,
      {
        "data-testid": testIDs.FeedBackDialogueCloseButton,
        height: 4,
        mb: 2,
        width: 4,
      },
      0
    );
  });

  it("should call the DimOnHover component correctly", () => {
    expect(DimOnHover).toBeCalledTimes(1);
    checkMockCall(
      DimOnHover,
      {
        pr: 2,
      },
      0
    );
  });

  it("should call the Flex component correctly", () => {
    expect(Flex).toBeCalledTimes(1);
    checkMockCall(
      Flex,
      {
        align: "center",
        justify: "space-between",
        mt: 2,
      },
      0
    );
  });

  it("should call the Text component correctly", () => {
    expect(Text).toBeCalledTimes(1);
    checkMockCall(
      Text,
      {
        ml: 2,
        mb: 2,
        mr: 2,
        fontSize: ["sm", "sm", "l"],
      },
      0
    );
  });
});
