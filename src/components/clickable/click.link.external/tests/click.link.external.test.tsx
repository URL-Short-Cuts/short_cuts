import { render, screen, fireEvent } from "@testing-library/react";
import NextLink from "next/link";
import mockAnalyticsHook from "../../../../hooks/tests/analytics.mock.hook";
import ClickExternalLink from "../click.link.external.component";

jest.mock("next/link", () =>
  require("../../../../tests/fixtures/mock.component.children.factory.class").factoryInstance.create(
    "NextLink"
  )
);

jest.mock("../../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

describe("ButtonLink", () => {
  const linkText = "Link";
  const mockHref = "mockTestName";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<ClickExternalLink href={mockHref}>{linkText}</ClickExternalLink>);
  };

  it("should render NextLink as expected", () => {
    expect(NextLink).toBeCalledTimes(1);
    const call = jest.mocked(NextLink).mock.calls[0];
    expect(call[0].href).toBe(mockHref);
    expect(call[0].target).toBe("_blank");
    expect(call[0].children).toBeDefined();
    expect(Object.keys(call[0]).length).toBe(3);
  });

  describe("when the link is clicked", () => {
    beforeEach(async () => {
      const link = await screen.findByText(linkText);
      expect(link).not.toBeNull();
      fireEvent.click(link as HTMLElement);
    });

    it("should call the link click tracker", () => {
      expect(mockAnalyticsHook.trackExternalLinkClick).toBeCalledTimes(1);
      const call = mockAnalyticsHook.trackExternalLinkClick.mock.calls[0];
      expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
      expect(call[1]).toBe(mockHref);
      expect(Object.keys(call).length).toBe(2);
    });
  });
});
