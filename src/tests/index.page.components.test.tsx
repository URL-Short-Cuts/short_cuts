import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import routes from "../config/routes";
import Events from "../events/events";
import Page from "../pages/index";
import mockCheckCall from "../tests/fixtures/mock.component.call";
import getPageProps from "../utils/page.props.static";

jest.mock("../utils/page.props.static", () => jest.fn());

jest.mock("../components/errors/boundary/error.boundary.component", () =>
  createMockedComponent("ErrorBoundary")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("getStaticProps", () => {
  it("should be generated by the correct call to pagePropsGenerator", () => {
    expect(getPageProps).toBeCalledTimes(1);
    expect(getPageProps).toBeCalledWith({
      pageKey: "home",
      translations: [],
    });
  });
});

describe("Index", () => {
  const arrange = () => {
    render(<Page />);
  };

  beforeEach(() => jest.clearAllMocks());

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

    it("should call the Splash component", async () => {
      await screen.findAllByText("Mock Index Page");
    });
  });
});
