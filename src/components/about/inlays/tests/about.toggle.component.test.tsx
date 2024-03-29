import { Container, ListItem, UnorderedList } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import translations from "../../../../../public/locales/en/about.json";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import tLookup from "../../../../tests/fixtures/mock.translation";
import Toggle from "../about.toggle.component";
import type { TFunction } from "../../../../types/translations/hook.types";

jest.mock("../../../icons/svs/svs.icon", () =>
  jest.fn(() => <div>MockIcon</div>)
);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Container", "ListItem", "UnorderedList"]);
});

describe("AboutToggle", () => {
  const mockT = jest.fn((key) => tLookup(key, translations)) as TFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<Toggle t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Container with the correct props", () => {
      expect(Container).toBeCalledTimes(1);
      checkMockCall(
        Container,
        {
          centerContent: true,
          pb: 5,
          pl: 5,
          pr: 5,
          ml: 2,
          fontSize: [12, 14, 14, "md"],
        },
        0
      );
    });

    it("should call ListItem with the correct props", () => {
      const expectedPadding = [0.5, 0.5, 0, 0];
      expect(ListItem).toBeCalledTimes(3);
      checkMockCall(
        ListItem,
        {
          p: expectedPadding,
        },
        0
      );
      checkMockCall(
        ListItem,
        {
          p: expectedPadding,
        },
        1
      );
      checkMockCall(
        ListItem,
        {
          p: expectedPadding,
        },
        2
      );
    });

    it("should call UnorderedList with the correct props", () => {
      expect(UnorderedList).toBeCalledTimes(1);
      checkMockCall(UnorderedList, {}, 0);
    });
  });
});
