import { fireEvent, render, screen } from "@testing-library/react";
import externalLinks from "../../../../config/external";
import FeedbackDialogue, { testIDs } from "../feedback.dialogue";

jest.mock("next/router", () => jest.requireActual("next-router-mock"));

describe("FeedbackDialogue", () => {
  const mockClose = jest.fn();
  const mockMessage = "mockMessage";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<FeedbackDialogue message={mockMessage} onClose={mockClose} />);
  };

  describe("when rendered", () => {
    it("should show the expected text", async () => {
      expect(await screen.findByText(mockMessage)).toBeTruthy();
    });
  });

  describe("when the icon is clicked", () => {
    let link: HTMLLinkElement;

    beforeEach(async () => {
      link = (await screen.findByTestId(testIDs.FeedBackDialogueIcon))
        ?.parentElement?.parentElement?.parentElement as HTMLLinkElement;
    });

    it("should navigate to the expected page", async () => {
      expect(link).toHaveAttribute("href", externalLinks.feedback);
    });
  });

  describe("when the close button is clicked", () => {
    beforeEach(async () => {
      const button = await screen.findByTestId(
        testIDs.FeedBackDialogueCloseButton
      );
      fireEvent.click(button);
    });

    it("should no longer show the expected text", async () => {
      expect(mockClose).toBeCalledTimes(1);
    });
  });
});
