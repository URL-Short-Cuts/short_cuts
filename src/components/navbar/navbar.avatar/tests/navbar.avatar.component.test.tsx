import { Avatar } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { HiScissors } from "react-icons/hi";
import NavBarAvatar from "../navbar.avatar.component";

jest.mock("@chakra-ui/react", () => {
  return {
    Avatar: jest.fn().mockImplementation(() => <div>MockComponent</div>),
    Box: jest.requireActual("@chakra-ui/react").Box,
  };
});

jest.mock(
  "../../../clickable/click.link.external/click.link.external.component",
  () => createMockedComponent("ClickLink")
);

jest.mock("../../../styles/hover.dim/hover.dim.styles", () =>
  createMockedComponent("DimOnHover")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("NavBarAvatar", () => {
  const mockHref = "https://google.ca";
  const mockImage = "https://imagesite.com/image.jpeg";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (image: string) => {
    render(<NavBarAvatar image={image} href={mockHref} />);
  };

  describe("with an image specified", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      arrange(mockImage);
    });

    it("should render the Avatar component correctly", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = (Avatar as jest.Mock).mock.calls[0][0];
      expect(call.cursor).toBe("pointer");
      expect(call.loading).toBe("eager");
      expect(call.size).toBe("sm");
      expect(call.src).toBe(mockImage);
      expect(renderToString(call.icon)).toBe(
        renderToString(<HiScissors size={25} />)
      );
    });
  });

  describe("with no image specified", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      arrange("");
    });

    it("should render the Avatar component correctly", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = (Avatar as jest.Mock).mock.calls[0][0];
      expect(call.cursor).toBe("pointer");
      expect(call.loading).toBe("eager");
      expect(call.size).toBe("sm");
      expect(call.src).toBe("");
      expect(renderToString(call.icon)).toBe(
        renderToString(<HiScissors size={25} />)
      );
    });
  });
});
