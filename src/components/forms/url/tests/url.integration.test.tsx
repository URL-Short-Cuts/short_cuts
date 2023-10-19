import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import formTranslations from "../../../../../public/locales/en/forms.json";
import UserInterfaceRootProvider from "../../../../providers/ui/ui.root.provider";
import mockRouter from "../../../../tests/fixtures/mock.router";
import tLookup from "../../../../tests/fixtures/mock.translation";
import FormUI from "../url.ui.component";
import type { TFunction } from "../../../../types/translations/hook.types";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: () => mockRouter,
}));

describe("FormIntegrationTest", () => {
  let enteredURL: string;
  const mockT = jest.fn((key) => tLookup(key, formTranslations)) as TFunction;
  const mockTitle = "mockTitle";
  const mockRoute = "/mock/route";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <UserInterfaceRootProvider>
        <FormUI t={mockT} title={mockTitle} route={mockRoute} />
      </UserInterfaceRootProvider>
    );
  };

  it("should display the correct title", async () => {
    expect(await screen.findByText(mockTitle)).toBeTruthy();
  });

  it("should display the correct field label", async () => {
    expect(
      await screen.findByText(formTranslations.url.fields.url.fieldLabel)
    ).toBeTruthy();
  });

  it("should display the correct input placeholder", async () => {
    expect(
      await screen.findByPlaceholderText(
        formTranslations.url.fields.url.fieldPlaceHolder
      )
    ).toBeTruthy();
  });

  it("should display the correct buttonText", async () => {
    expect(
      await screen.findByText(formTranslations.url.buttonText)
    ).toBeTruthy();
  });

  describe("given no url", () => {
    beforeEach(async () => {
      const element = screen.getByPlaceholderText(
        formTranslations.url.fields.url.fieldPlaceHolder
      ) as HTMLInputElement;
      expect(element.value).toBe("");
    });

    describe("when search is pressed", () => {
      beforeEach(async () => {
        const element = screen.getByText(formTranslations.url.buttonText);
        await waitFor(() => fireEvent.click(element));
      });

      it("should show an error message", async () => {
        expect(
          await screen.findByText(
            formTranslations.url.fields.url.errors.required
          )
        ).toBeTruthy();
      });
    });
  });

  describe("given an invalid url", () => {
    beforeEach(async () => {
      enteredURL = "invalid";
      const element = screen.getByPlaceholderText(
        formTranslations.url.fields.url.fieldPlaceHolder
      ) as HTMLInputElement;
      expect(element.value).toBe("");
      await waitFor(() =>
        fireEvent.change(element, { target: { value: enteredURL } })
      );
    });

    describe("when search is pressed", () => {
      beforeEach(async () => {
        const element = screen.getByText(formTranslations.url.buttonText);
        await waitFor(() => fireEvent.click(element));
      });

      it("should show an error message", async () => {
        expect(
          await screen.findByText(
            formTranslations.url.fields.url.errors.invalid
          )
        ).toBeTruthy();
      });
    });
  });

  describe("given a valid username", () => {
    beforeEach(async () => {
      enteredURL = "http://yahoo.com";
      const element = screen.getByPlaceholderText(
        formTranslations.url.fields.url.fieldPlaceHolder
      );
      await waitFor(() =>
        fireEvent.change(element, { target: { value: enteredURL } })
      );
    });

    describe("when search is pressed", () => {
      beforeEach(async () => {
        const element = screen.getByText(formTranslations.url.buttonText);
        await waitFor(() => fireEvent.click(element));
      });

      it("should redirect to the expected page", () => {
        const params = {
          url: enteredURL,
        };
        const query = new URLSearchParams(params);
        expect(mockRouter.push).toBeCalledTimes(1);
        expect(mockRouter.push).toBeCalledWith(
          `${mockRoute}?${query.toString()}`
        );
      });
    });
  });
});
