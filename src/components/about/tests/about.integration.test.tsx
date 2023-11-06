import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import translations from "../../../../public/locales/en/about.json";
import routes from "../../../config/routes";
import mockRouter from "../../../tests/fixtures/mock.router";
import { testIDs } from "../../dialogues/resizable/dialogue.resizable.component";
import About from "../about.component";

jest.mock("next/router", () => ({ useRouter: jest.fn(() => mockRouter) }));

describe("About", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<About />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should render the correct text inside the visible UnorderedList", async () => {
      const aboutList = await screen.findByTestId(
        testIDs.DialogueToggleComponent
      );
      expect(aboutList).toBeVisible();
      expect(
        await within(aboutList).findByText(translations.aboutText1)
      ).toBeTruthy();
      expect(
        await within(aboutList).findByText(translations.aboutText2)
      ).toBeTruthy();
      expect(
        await within(aboutList).findByText(translations.aboutText3)
      ).toBeTruthy();
    });

    it("should render the credit text on the screen", async () => {
      expect(await screen.findByText(translations.creditText)).toBeTruthy();
    });

    it("should render the company name on the screen", async () => {
      expect(await screen.findByText(translations.company)).toBeTruthy();
    });

    it("should render button text inside the start button", async () => {
      const footer = await screen.findByTestId(testIDs.DialogueFooterComponent);
      expect(
        await within(footer).findByText(translations.buttons.start)
      ).toBeTruthy();
    });

    it("should render button text inside the privacy button", async () => {
      const footer = await screen.findByTestId(testIDs.DialogueFooterComponent);
      expect(
        await within(footer).findByText(translations.buttons.privacy)
      ).toBeTruthy();
    });

    describe("clicking on the start button", () => {
      beforeEach(async () => {
        expect(mockRouter.push).toBeCalledTimes(0);
        const footer = await screen.findByTestId(
          testIDs.DialogueFooterComponent
        );
        const button = await within(footer).findByText(
          translations.buttons.start
        );
        fireEvent.click(button);
      });

      it("should redirect to the home page", async () => {
        await waitFor(() => expect(mockRouter.push).toBeCalledTimes(1));
        expect(mockRouter.push).toBeCalledWith(routes.home);
      });
    });

    describe("clicking on the privacy button", () => {
      beforeEach(async () => {
        window.alert = jest.fn();
        expect(mockRouter.push).toBeCalledTimes(0);
        const footer = await screen.findByTestId(
          testIDs.DialogueFooterComponent
        );
        const button = await within(footer).findByText(
          translations.buttons.privacy
        );
        fireEvent.click(button);
      });

      it("should open the placeholder alert", async () => {
        expect(window.alert).toBeCalledTimes(1); // Placeholder
      });
    });
  });
});
