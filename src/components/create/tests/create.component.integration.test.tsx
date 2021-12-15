import { render, screen, fireEvent } from "@testing-library/react";
import createTranslations from "../../../../public/locales/en/create.json";
import translations from "../../../../public/locales/en/main.json";
import routes from "../../../config/routes";
import mockUseUrl from "../../../hooks/tests/url.hook.mock";
import mockRouter from "../../../tests/fixtures/mock.router";
import CreateContainer from "../create.container.component";
import { TestIDs } from "../inlays/create.body.component";

jest.mock("../../../hooks/url", () => {
  return jest.fn().mockImplementation(() => mockUseUrl);
});

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: () => mockRouter,
}));

describe("CreateContainer", () => {
  const mockClipBoard = jest.fn();

  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: mockClipBoard,
      },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (url: string) => {
    return render(<CreateContainer url={url} />);
  };

  describe("when rendered with a valid url", () => {
    const mockUrl = "http://yahoo.com";

    describe("after creation is successful", () => {
      beforeEach(() => {
        mockUseUrl.status = 201;
        mockUseUrl.created = mockUrl;
        arrange(mockUrl);
      });

      it("should display the error title", async () => {
        expect(await screen.findByText(createTranslations.title)).toBeTruthy();
      });

      it("should display the button text", async () => {
        expect(
          await screen.findByText(createTranslations.buttons.again)
        ).toBeTruthy();
      });

      describe("clicking the clipboard button", () => {
        beforeEach(async () => {
          const button = await screen.findByTestId(TestIDs.CreateUrlClipBoard);
          fireEvent.click(button);
        });

        it("should load the clipboard", async () => {
          expect(mockClipBoard).toBeCalledTimes(1);
          expect(mockClipBoard).toBeCalledWith(mockUrl);
        });
      });

      describe("clicking the again button", () => {
        beforeEach(async () => {
          const button = await screen.findByText(
            createTranslations.buttons.again
          );
          fireEvent.click(button);
        });

        it("should route to the home page", () => {
          expect(mockRouter.push).toBeCalledWith(routes.home);
        });
      });
    });

    describe("after creation is unsuccessful", () => {
      beforeEach(() => {
        mockUseUrl.status = 400;
        mockUseUrl.created = null;
        arrange(mockUrl);
      });

      it("should display the error title", async () => {
        expect(
          await screen.findByText(translations.errors.generic.title)
        ).toBeTruthy();
      });

      it("should display the error message", async () => {
        expect(
          await screen.findByText(translations.errors.generic.message)
        ).toBeTruthy();
      });

      it("should display the error button", async () => {
        expect(
          await screen.findByText(translations.errors.generic.resetButton)
        ).toBeTruthy();
      });

      describe("clicking the reset button", () => {
        beforeEach(async () => {
          const button = await screen.findByText(
            translations.errors.generic.resetButton
          );
          fireEvent.click(button);
        });

        it("should route to the home page", async () => {
          expect(mockRouter.push).toBeCalledWith(routes.home);
        });
      });
    });
  });
});
