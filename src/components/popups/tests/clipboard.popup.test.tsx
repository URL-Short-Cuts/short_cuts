import { render } from "@testing-library/react";
import translations from "../../../../public/locales/en/main.json";
import mockUserInterfaceHook from "../../../hooks/tests/ui.mock.hook";
import ClipBoardPopUp from "../clipboard.popup";
import ClipBoardDialogue from "../dialogues/clipboard.dialogue";
import PopUp from "../popup/popup.component";

jest.mock("../popup/popup.component", () =>
  jest.fn(() => <div>MockPopup</div>)
);

jest.mock("../../../hooks/ui", () => ({
  __esModule: true,
  default: () => mockUserInterfaceHook,
}));

describe("ClipBoardPopUp", () => {
  const mockPopUpName = "ClipBoard";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<ClipBoardPopUp />);
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
      expect(call.message).toBe(translations.popups.ClipBoard);
      expect(call.Component).toBe(ClipBoardDialogue);
    });
  });
});
