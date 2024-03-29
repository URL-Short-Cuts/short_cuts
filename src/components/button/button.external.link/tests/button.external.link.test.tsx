import { render } from "@testing-library/react";
import ClickLink from "../../../clickable/click.link.external/click.link.external.component";
import BaseButton from "../../button.base/button.base.component";
import StyledButtonLink from "../button.external.link.component";

jest.mock(
  "../../../clickable/click.link.external/click.link.external.component",
  () =>
    require("../../../../tests/fixtures/mock.component.children.factory.class").factoryInstance.create(
      "ClickLink"
    )
);

jest.mock("../../button.base/button.base.component", () =>
  require("../../../../tests/fixtures/mock.component.children.factory.class").factoryInstance.create(
    "BaseButton"
  )
);

describe("ButtonLink", () => {
  const linkText = "Link";
  const mockHref = "mockTestName";
  const mockColour = "mockColour";
  const mockClickHandler = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <StyledButtonLink
        onClick={mockClickHandler}
        bg={mockColour}
        href={mockHref}
      >
        {linkText}
      </StyledButtonLink>
    );
  };

  it("should render ClickLink as expected", () => {
    expect(ClickLink).toBeCalledTimes(1);
    const call = (ClickLink as jest.Mock).mock.calls[0];
    expect(call[0].href).toBe(mockHref);
    expect(call[0].children).toBeDefined();
    expect(Object.keys(call[0]).length).toBe(2);
  });

  it("should render BaseButton as expected", () => {
    expect(BaseButton).toBeCalledTimes(1);
    const call = (BaseButton as jest.Mock).mock.calls[0];
    expect(call[0].bg).toBe(mockColour);
    expect(call[0].children).toBeDefined();
    expect(call[0].onClick).toBe(mockClickHandler);
    expect(Object.keys(call[0]).length).toBe(3);
  });
});
