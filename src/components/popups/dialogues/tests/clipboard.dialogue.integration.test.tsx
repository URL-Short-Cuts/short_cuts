import { fireEvent, render, screen } from "@testing-library/react";
import ClipBoardDialogue, { testIDs } from "../clipboard.dialogue";

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

  describe("when rendered", () => {
    it("should show the expected text", async () => {
      expect(await screen.findByText(mockMessage)).toBeTruthy();
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
