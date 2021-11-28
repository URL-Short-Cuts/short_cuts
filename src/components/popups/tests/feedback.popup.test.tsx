import { render } from "@testing-library/react";
import translations from "../../../../public/locales/en/main.json";
import mockUserInterfaceHook from "../../../hooks/tests/ui.mock.hook";
import FeedbackDialogue from "../dialogues/feedback.dialogue";
import FeedbackPopUp from "../feedback.popup";
import PopUp from "../popup/popup.component";

jest.mock("../popup/popup.component", () =>
  jest.fn(() => <div>MockPopup</div>)
);

jest.mock("../../../hooks/ui", () => ({
  __esModule: true,
  default: () => mockUserInterfaceHook,
}));

describe("FeedBackPopup", () => {
  const mockPopUpName = "FeedBack";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<FeedbackPopUp />);
  };

  describe("popup state is closed", () => {
    beforeEach(() => {
      mockUserInterfaceHook.popups.status.mockReturnValue(false);
      arrange();
    });

    it("should NOT call the PopUp component", () => {
      expect(PopUp).toBeCalledTimes(0);
    });
  });

  describe("popup state is open", () => {
    beforeEach(() => {
      mockUserInterfaceHook.popups.status.mockReturnValue(true);
      arrange();
    });

    it("should call the PopUp component", () => {
      expect(PopUp).toBeCalledTimes(1);
      const call = (PopUp as jest.Mock).mock.calls[0][0];
      expect(call.name).toBe(mockPopUpName);
      expect(call.message).toBe(translations.popups.FeedBack);
      expect(call.Component).toBe(FeedbackDialogue);
    });
  });
});
