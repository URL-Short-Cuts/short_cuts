import { renderHook } from "@testing-library/react";
import dk from "deep-keys";
import mockUseColour from "./colour.hook.mock";
import useColour from "../colour";

jest.mock("@chakra-ui/react", () => ({
  useColorMode: () => ({
    colorMode: mockColourMode,
  }),
}));

let mockColourMode = "light";

describe("useColour", () => {
  let received: ReturnType<typeof arrange>;

  const assertIsString = (property: string) => {
    expect(typeof property).toBe("string");
  };

  const assertLenIs = (
    object: Record<
      string,
      string | Record<string, string | Record<string, string>>
    >,
    length: number
  ) => {
    expect(Object.keys(object).length).toBe(length);
  };

  const checkProperties = () => {
    it("should contain the correct number of top level properties", () => {
      assertLenIs(received.result.current, 12);
    });

    it("should contain the bodyColour background color", () => {
      assertIsString(received.result.current.bodyColour.background);
      assertLenIs(received.result.current.bodyColour, 1);
    });

    it("should contain the buttonColour properties", () => {
      assertIsString(received.result.current.buttonColour.background);
      assertIsString(received.result.current.buttonColour.border);
      assertIsString(received.result.current.buttonColour.foreground);
      assertIsString(received.result.current.buttonColour.hoverBackground);
      assertLenIs(received.result.current.buttonColour, 4);
    });

    it("should contain the componentColour properties", () => {
      assertIsString(received.result.current.componentColour.background);
      assertIsString(received.result.current.componentColour.border);
      assertIsString(received.result.current.componentColour.foreground);
      assertIsString(received.result.current.componentColour.details);
      assertIsString(received.result.current.componentColour.scheme);
      assertLenIs(received.result.current.componentColour, 5);
    });

    it("should contain the consentColour properties", () => {
      assertIsString(received.result.current.consentColour.accept.background);
      assertIsString(received.result.current.consentColour.decline.background);
      assertLenIs(received.result.current.consentColour, 2);
      assertLenIs(received.result.current.consentColour.accept, 1);
      assertLenIs(received.result.current.consentColour.decline, 1);
    });

    it("should contain the feedbackColour properties", () => {
      assertIsString(received.result.current.feedbackColour.background);
      assertIsString(received.result.current.feedbackColour.border);
      assertIsString(received.result.current.feedbackColour.foreground);
      assertLenIs(received.result.current.feedbackColour, 3);
    });

    it("should contain the highlightColour properties", () => {
      assertIsString(received.result.current.highlightColour.background);
      assertIsString(received.result.current.highlightColour.border);
      assertIsString(received.result.current.highlightColour.foreground);
      assertLenIs(received.result.current.highlightColour, 3);
    });

    it("should contain the inputColour properties", () => {
      assertIsString(received.result.current.inputColour.background);
      assertIsString(received.result.current.inputColour.border);
      assertIsString(received.result.current.inputColour.foreground);
      assertLenIs(received.result.current.inputColour, 3);
    });

    it("should contain the modalColour properties", () => {
      assertIsString(received.result.current.inputColour.background);
      assertIsString(received.result.current.inputColour.border);
      assertIsString(received.result.current.inputColour.foreground);
      assertLenIs(received.result.current.inputColour, 3);
    });

    it("should contain the navButtonColour properties", () => {
      assertIsString(received.result.current.navButtonColour.background);
      assertIsString(received.result.current.navButtonColour.hoverBackground);
      assertIsString(
        received.result.current.navButtonColour.selectedBackground
      );
      assertLenIs(received.result.current.navButtonColour, 3);
    });

    it("should contain the notificationColour properties", () => {
      assertIsString(received.result.current.notificationColour.background);
      assertIsString(received.result.current.notificationColour.border);
      assertIsString(received.result.current.notificationColour.foreground);
      assertLenIs(received.result.current.navButtonColour, 3);
    });

    it("should contain the warningIconColour properties", () => {
      assertIsString(received.result.current.warningIconColour.icon);
      assertLenIs(received.result.current.navButtonColour, 3);
    });

    it("should contain an entry for transparent", () => {
      assertIsString(received.result.current.transparent);
    });
  };

  const checkMockProperties = () => {
    it("should contain all the same properties as the mock colour hook", () => {
      const mockObjectKeys = dk(mockUseColour).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });
  };

  const arrange = () => {
    return renderHook(() => useColour());
  };

  describe("when it's light mode", () => {
    beforeEach(() => {
      mockColourMode = "light";
      received = arrange();
    });

    it("should return a light mode background colour", () => {
      expect(received.result.current.bodyColour.background).toBe("gray.400");
    });

    checkProperties();
    checkMockProperties();
  });

  describe("when it's dark mode", () => {
    beforeEach(() => {
      mockColourMode = "dark";
      received = arrange();
    });

    it("should return a dark mode background colour", () => {
      expect(received.result.current.bodyColour.background).toBe("gray.500");
    });

    checkProperties();
    checkMockProperties();
  });
});
