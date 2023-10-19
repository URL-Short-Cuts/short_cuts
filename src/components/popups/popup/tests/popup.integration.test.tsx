import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import MockPopupDialogue, {
  testIDs,
  testColours,
} from "./fixtures/mock.popup.dialogue";
import { UserInterfacePopUpsContext } from "../../../../providers/ui/ui.popups/ui.popups.provider";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import Popup from "../popup.component";

describe("PopUp", () => {
  const mockPopUpName = "FeedBack";
  const mockMessage = "mockMessage";
  const mockDispatch = jest.fn();
  let isOpen: boolean;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <ChakraProvider>
        <ColorModeProvider>
          <UserInterfacePopUpsContext.Provider
            value={{
              dispatch: mockDispatch,
              status: {
                [mockPopUpName]: { status: isOpen },
                ClipBoard: { status: isOpen },
              },
            }}
          >
            <Popup
              name={mockPopUpName}
              message={mockMessage}
              Component={MockPopupDialogue}
            />
          </UserInterfacePopUpsContext.Provider>
        </ColorModeProvider>
      </ChakraProvider>
    );
  };

  describe("when the popup is open", () => {
    beforeEach(() => {
      isOpen = true;
    });

    describe("when rendered", () => {
      beforeEach(() => {
        isOpen = true;
        arrange();
      });

      it("should only open once (and rerender)", () => {
        expect(MockPopupDialogue).toBeCalledTimes(1);
        checkMockCall(
          MockPopupDialogue,
          {
            message: mockMessage,
          },
          0,
          ["onClose"]
        );
      });

      it("should display the mock component", async () => {
        expect(
          await screen.findByTestId(testIDs.MockPopUpComponent)
        ).toBeTruthy();
      });

      it("should display the correct colour value (rerender the component)", async () => {
        const measurement = await screen.findByTestId(
          testIDs.MockPopUpComponentColourMeasure
        );
        expect(
          await within(measurement).findByText(testColours.light)
        ).toBeTruthy();
      });
    });

    describe("when closed", () => {
      beforeEach(async () => {
        arrange();
        const component = await screen.findByTestId(
          testIDs.MockPopUpComponentCloseButton
        );
        fireEvent.click(component);
      });

      it("should dispatch to close the popup", async () => {
        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch).toBeCalledWith({
          name: mockPopUpName,
          type: "HidePopUp",
        });
      });
    });

    describe("when the colour mode is toggled", () => {
      beforeEach(async () => {
        arrange();
        const component = await screen.findByTestId(
          testIDs.MockPopUpComponentColourToggle
        );
        fireEvent.click(component);
      });

      it("should display the correct colour value", async () => {
        const measurement = await screen.findByTestId(
          testIDs.MockPopUpComponentColourMeasure
        );
        expect(
          await within(measurement).findByText(testColours.dark)
        ).toBeTruthy();
      });
    });

    describe("when the colour mode is toggled (again)", () => {
      beforeEach(async () => {
        arrange();
        const component = await screen.findByTestId(
          testIDs.MockPopUpComponentColourToggle
        );
        fireEvent.click(component);
      });

      it("should display the correct colour value", async () => {
        const measurement = await screen.findByTestId(
          testIDs.MockPopUpComponentColourMeasure
        );
        expect(
          await within(measurement).findByText(testColours.light)
        ).toBeTruthy();
      });
    });
  });

  describe("when the popup is closed", () => {
    beforeEach(() => {
      isOpen = false;
    });

    describe("when rendered", () => {
      beforeEach(() => {
        isOpen = false;
        arrange();
      });

      it("should NOT display the mock component", async () => {
        await waitFor(() =>
          expect(screen.queryByTestId(testIDs.MockPopUpComponent)).toBeNull()
        );
      });
    });
  });
});
