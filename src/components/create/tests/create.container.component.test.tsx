import { render } from "@testing-library/react";
import translations from "../../../../public/locales/en/main.json";
import mockUseUrl from "../../../hooks/tests/url.hook.mock";
import checkMockCall from "../../../tests/fixtures/mock.component.call";
import BillBoardSpinner from "../../billboard/billboard.spinner/billboard.spinner.component";
import ErrorDisplay from "../../errors/display/error.display.component";
import CreateComponent from "../create.component";
import CreateContainer from "../create.container.component";

jest.mock("../../../hooks/url", () => {
  return jest.fn().mockImplementation(() => mockUseUrl);
});
jest.mock("../../billboard/billboard.spinner/billboard.spinner.component", () =>
  jest.fn(() => <div>BillboardSpinner</div>)
);
jest.mock("../../errors/display/error.display.component", () =>
  jest.fn(() => <div>ErrorDisplay</div>)
);
jest.mock("../create.component", () =>
  jest.fn(() => <div>CreateContainer</div>)
);

describe("CreateContainer", () => {
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

      it("should NOT call the resetCreateUrl hook", () => {
        expect(mockUseUrl.resetCreateUrl).toBeCalledTimes(1);
      });

      it("should NOT call the createUrl hook", () => {
        expect(mockUseUrl.createUrl).toBeCalledTimes(0);
      });

      it("should render the Created component", () => {
        expect(CreateComponent).toBeCalledTimes(1);
        expect(CreateComponent).toBeCalledWith({ url: mockUrl }, {});
      });
    });

    describe("after creation is unsuccessful", () => {
      beforeEach(() => {
        mockUseUrl.status = 400;
        mockUseUrl.created = null;
        arrange(mockUrl);
      });

      it("should call the resetCreateUrl hook", () => {
        expect(mockUseUrl.resetCreateUrl).toBeCalledTimes(1);
      });

      it("should NOT call the createUrl hook", () => {
        expect(mockUseUrl.createUrl).toBeCalledTimes(0);
      });

      it("should render the ErrorDisplay component", () => {
        expect(ErrorDisplay).toBeCalledTimes(1);
        checkMockCall(
          ErrorDisplay,
          {
            errorKey: "generic",
          },
          0,
          ["resetError"]
        );
      });
    });

    describe("when the fetching is ongoing", () => {
      beforeEach(() => {
        mockUseUrl.status = null;
        mockUseUrl.created = null;
        arrange(mockUrl);
      });

      it("should NOT call the resetCreateUrl hook", () => {
        expect(mockUseUrl.resetCreateUrl).toBeCalledTimes(0);
      });

      it("should call the createUrl hook", () => {
        expect(mockUseUrl.createUrl).toBeCalledTimes(1);
        expect(mockUseUrl.createUrl).toBeCalledWith(mockUrl);
      });

      it("should render the BillBoardSpinner component", () => {
        expect(BillBoardSpinner).toBeCalledTimes(1);
        checkMockCall(
          BillBoardSpinner,
          {
            title: translations.loading,
            visible: true,
          },
          0,
          ["resetError"]
        );
      });
    });
  });
});
