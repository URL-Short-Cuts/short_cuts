import { render, waitFor, cleanup } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import mockNavBarHook from "../../../../hooks/tests/navbar.mock.hook";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import mockRouter from "../../../../tests/fixtures/mock.router";
import SearchContainer from "../url.container.component";
import SearchForm from "../url.form.component";
import type { URLFormInterface } from "../../../../types/forms/url.d";
import type { FormikHelpers } from "formik";

jest.mock("../url.form.component", () => {
  return jest.fn().mockImplementation(() => <div id="url">MockSearchForm</div>);
});

jest.mock("../../../../hooks/navbar", () => {
  return jest.fn().mockImplementation(() => mockNavBarHook);
});

describe("FormContainer", () => {
  let validateURL: (url: string) => string | undefined;
  let handleSubmit: (
    values: URLFormInterface,
    actions: FormikHelpers<URLFormInterface>
  ) => void;
  const mockRoute = "/a/very/fancy/route/to/something";
  const mockOpenError = jest.fn();
  const mockCloseError = jest.fn();
  const mockT = jest.fn((arg: string) => `t(${arg})`);

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <SearchContainer
          closeError={mockCloseError}
          openError={mockOpenError}
          route={mockRoute}
          t={mockT}
        />
      </RouterContext.Provider>
    );
  };

  it("should attempt to hide the NavBar during render", () => {
    arrange();
    expect(mockNavBarHook.hideNavBar).toBeCalledTimes(1);
  });

  it("should attempt to hide the NavBar during a screen resize", () => {
    arrange();
    expect(mockNavBarHook.hideNavBar).toBeCalledTimes(1);
    global.dispatchEvent(new Event("resize"));
    expect(mockNavBarHook.hideNavBar).toBeCalledTimes(2);
  });

  it("should show the NavBar during cleanup", async () => {
    arrange();
    cleanup();
    await waitFor(() => expect(mockNavBarHook.showNavBar).toBeCalledTimes(1));
  });

  it("should render the SearchForm with the correct props", () => {
    arrange();
    expect(SearchForm).toBeCalledTimes(1);
    checkMockCall(SearchForm, {}, 0, ["t", "handleSubmit", "validateURL"]);
  });

  describe("validateURL", () => {
    let returnValue: string | undefined;

    beforeEach(() => jest.clearAllMocks());

    beforeEach(() => {
      arrange();
      expect(SearchForm).toBeCalledTimes(1);
      validateURL = (SearchForm as jest.Mock).mock.calls[0][0].validateURL;
    });

    describe("when called on a non-existing url", () => {
      beforeEach(() => (returnValue = validateURL("")));

      it("should return the correct value", () => {
        expect(returnValue).toBe("t(url.fields.url.errors.required)");
        expect(mockT).toBeCalledWith("url.fields.url.errors.required");
      });

      it("should generate an error", () => {
        expect(mockOpenError).toBeCalledTimes(1);
        expect(mockOpenError).toBeCalledWith(
          "url",
          "t(url.fields.url.errors.required)"
        );
        expect(mockT).toBeCalledWith("url.fields.url.errors.required");
      });
    });

    describe("when called on a valid url", () => {
      beforeEach(() => (returnValue = validateURL("http://somevalidurl.com")));

      it("should return the correct value", () => {
        expect(returnValue).toBe(undefined);
      });

      it("should NOT generate an error", () => {
        expect(mockOpenError).toBeCalledTimes(0);
      });

      it("should close existing errors", () => {
        expect(mockCloseError).toBeCalledTimes(1);
        expect(mockCloseError).toBeCalledWith("url");
      });
    });

    describe("when called on an invalid url", () => {
      beforeEach(() => (returnValue = validateURL("http://localhost")));

      it("should return the correct value", () => {
        expect(returnValue).toBe("t(url.fields.url.errors.invalid)");
        expect(mockT).toBeCalledWith("url.fields.url.errors.invalid");
      });

      it("should generate an error", () => {
        expect(mockOpenError).toBeCalledTimes(1);
        expect(mockOpenError).toBeCalledWith(
          "url",
          "t(url.fields.url.errors.invalid)"
        );
        expect(mockT).toBeCalledWith("url.fields.url.errors.invalid");
      });
    });
  });

  describe("handleSubmit", () => {
    const arrangeHandleSubmit = () => {
      arrange();
      expect(SearchForm).toBeCalledTimes(1);
      handleSubmit = (SearchForm as jest.Mock).mock.calls[0][0].handleSubmit;
    };

    const mockAction = {
      setSubmitting: jest.fn(),
    } as never as FormikHelpers<URLFormInterface>;
    const mockValidFormContent = { url: "http://validurl.com" };

    describe("when submitted with a valid url", () => {
      beforeEach(() => {
        arrangeHandleSubmit();
        handleSubmit(mockValidFormContent, mockAction);
      });

      it("should NOT call setSubmitting as expected", () => {
        expect(mockAction.setSubmitting).toBeCalledTimes(0);
      });

      it("should redirect to the expected route", () => {
        const query = new URLSearchParams(mockValidFormContent);
        expect(mockRouter.push).toBeCalledTimes(1);
        expect(mockRouter.push).toBeCalledWith(
          `${mockRoute}?${query.toString()}`
        );
      });
    });
  });
});
