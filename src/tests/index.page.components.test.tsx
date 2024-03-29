import { render } from "@testing-library/react";
import formTranslations from "../../public/locales/en/forms.json";
import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import FormUI from "../components/forms/url/url.ui.component";
import routes from "../config/routes";
import Events from "../events/events";
import Page, { getStaticProps } from "../pages/index";
import mockCheckCall from "../tests/fixtures/mock.component.call";
import mockTranslationLookups from "../tests/fixtures/mock.translation";
import getPageProps from "../utils/page.props.static";

jest.mock("../utils/page.props.static", () =>
  jest.fn(() => "mockGetStaticProps")
);
jest.mock("../components/errors/boundary/error.boundary.component", () =>
  require("../tests/fixtures/mock.component.children.factory.class").factoryInstance.create(
    "ErrorBoundary"
  )
);

jest.mock("../components/forms/url/url.ui.component", () =>
  jest.fn(() => <div>MockForm</div>)
);

jest.mock("next-i18next", () => {
  return {
    useTranslation: () => {
      return {
        t: mockT,
      };
    },
  };
});

const mockT = jest.fn();

describe("getStaticProps", () => {
  it("should be generated by the correct call to pagePropsGenerator", () => {
    expect(getPageProps).toBeCalledTimes(1);
    expect(getPageProps).toBeCalledWith({
      pageKey: "home",
      translations: ["forms"],
    });
    expect(getStaticProps).toBe("mockGetStaticProps");
  });
});

describe("Index", () => {
  const arrange = () => {
    render(<Page />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockT.mockImplementation((translationKey: string) =>
      mockTranslationLookups(translationKey, formTranslations)
    );
  });

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call the ErrorBoundary component correctly", () => {
      expect(ErrorBoundary).toBeCalledTimes(1);
      mockCheckCall(
        ErrorBoundary,
        {
          route: routes.home,
          eventDefinition: Events.General.Error,
        },
        0,
        ["stateReset"]
      );
    });

    it("should call the FormUI component correctly", () => {
      expect(FormUI).toBeCalledTimes(1);
      mockCheckCall(
        FormUI,
        {
          route: routes.create,
          title: formTranslations.url.title,
        },
        0,
        ["stateReset", "t"]
      );
    });
  });
});
