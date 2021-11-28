import { Box, IconButton } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import externalLinks from "../../../config/external";
import NavConfig from "../../../config/navbar";
import mockColourHook from "../../../hooks/tests/colour.hook.mock";
import { NavBarContext } from "../../../providers/navbar/navbar.provider";
import checkMockCall from "../../../tests/fixtures/mock.component.call";
import NavBarColorModeToggle from "../navbar.color.mode/navbar.color.mode.component";
import NavBar, { testIDs } from "../navbar.component";
import { fetchPlaceHolderHook } from "../navbar.fetch.hook";
import NavBarLogo from "../navbar.logo/navbar.logo.component";
import NavBarOptions from "../navbar.options/navbar.options.component";
import NavSpinner from "../navbar.spinner/navbar.spinner.component";

jest.mock("../navbar.fetch.hook", () => ({
  fetchPlaceHolderHook: jest.fn(),
}));

jest.mock("../../../hooks/colour", () => {
  return () => mockColourHook;
});

jest.mock("../navbar.color.mode/navbar.color.mode.component", () =>
  createMockedComponent("NavBarColorModeToggle")
);

jest.mock("../navbar.logo/navbar.logo.component", () =>
  createMockedComponent("NavBarLogo")
);

jest.mock("../navbar.options/navbar.options.component", () =>
  createMockedComponent("NavBarOptions")
);

jest.mock("../navbar.spinner/navbar.spinner.component", () =>
  createMockedComponent("NavSpinner")
);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Box", "IconButton"]);
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

const mockedComponents = {
  NavBarLogo: "NavBarLogo",
  NavBarOptions: "NavBarOptions",
  NavSpinner: "NavSpinner",
};

describe("NavBar", () => {
  const config = NavConfig.menuConfig;
  const mockAvatarImage = "https://someurl/image.jpg";
  let transaction = false;
  let visible: boolean;

  const topLevelBoxProps = {
    bg: mockColourHook.componentColour.background,
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    borderColor: mockColourHook.componentColour.border,
    color: mockColourHook.componentColour.foreground,
    "data-testid": "NavBarRoot",
    fontSize: [18, 18, 20],
    px: 4,
    style: {
      position: "fixed",
      top: 0,
      width: "100%",
    },
    sx: {
      caretColor: mockColourHook.transparent,
    },
    zIndex: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (show: boolean) => {
    const setIsVisible = jest.fn();
    render(
      <NavBarContext.Provider value={{ isVisible: show, setIsVisible }}>
        <NavBar menuConfig={config} />
      </NavBarContext.Provider>
    );
  };

  describe("when the state has been programmed to NOT show the navbar", () => {
    beforeEach(() => {
      visible = false;
    });

    describe("when rendered", () => {
      beforeEach(() => {
        (fetchPlaceHolderHook as jest.Mock).mockReturnValue({
          isFetching: transaction,
          data: {
            avatarLink: externalLinks.defaultProfile,
            avatarImage: "",
          },
        });
        arrange(visible);
      });

      it("should NOT render the navbar at all", () => {
        expect(screen.queryByTestId(testIDs.NavBarRoot)).toBeNull();
      });
    });
  });

  describe("when the state has been programmed to show the navbar", () => {
    beforeEach(() => {
      visible = true;
    });

    describe("when data is pending", () => {
      beforeEach(() => {
        (fetchPlaceHolderHook as jest.Mock).mockReturnValue({
          isFetching: true,
          data: {
            avatarLink: null,
            avatarImage: null,
          },
        });
        arrange(visible);
      });

      it("should render the Box component as expected", async () => {
        expect(Box).toBeCalledTimes(1);
        checkMockCall(Box, topLevelBoxProps);
      });

      it("should render the logo component with defaults", async () => {
        expect(
          await screen.findByTestId(mockedComponents.NavBarLogo)
        ).toBeTruthy();
        expect(NavBarLogo).toBeCalledTimes(1);
        const call = (NavBarLogo as jest.Mock).mock.calls[0][0];
        expect(call.href).toBe(null);
        expect(call.image).toBe(null);
      });

      it("should render the spinner component", async () => {
        expect(
          await screen.findByTestId(mockedComponents.NavSpinner)
        ).toBeTruthy();
        expect(
          (NavSpinner as jest.Mock).mock.calls[0][0].whileTrue
        ).toBeTruthy();
      });

      it("should render the menu once, inside the spinner", async () => {
        const spinner = await screen.findByTestId(mockedComponents.NavSpinner);
        within(spinner).findByTestId(testIDs.NavBarMenu);
      });

      it("should render the NavBarColorModeToggle", async () => {
        expect(NavBarColorModeToggle).toBeCalledTimes(1);
      });

      it("should render the menu options once, inside the menu", async () => {
        const menu = await screen.findByTestId(testIDs.NavBarMenu);
        within(menu).findByTestId(mockedComponents.NavBarOptions);
        expect(NavBarOptions).toBeCalledTimes(1);
      });

      it("should NOT render the mobile menu", async () => {
        expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
      });

      it("should render the menu button with the right props", () => {
        expect(IconButton).toBeCalledTimes(1);
        const call = (IconButton as jest.Mock).mock.calls[0][0];
        expect(call.display).toStrictEqual({ sm: "none" });
      });
    });

    describe("when data is not pending", () => {
      beforeEach(() => {
        transaction = false;
      });

      describe("with user data received", () => {
        beforeEach(() => {
          (fetchPlaceHolderHook as jest.Mock).mockReturnValue({
            isFetching: transaction,
            data: {
              avatarLink: externalLinks.defaultProfile,
              avatarImage: mockAvatarImage,
            },
          });
          arrange(true);
        });

        it("should render the Box component as expected", async () => {
          expect(Box).toBeCalledTimes(1);
          checkMockCall(Box, topLevelBoxProps);
        });

        it("should render the logo component with user data", async () => {
          expect(
            await screen.findByTestId(mockedComponents.NavBarLogo)
          ).toBeTruthy();
          expect(NavBarLogo).toBeCalledTimes(1);
          const call = (NavBarLogo as jest.Mock).mock.calls[0][0];
          expect(call.href).toBe(externalLinks.defaultProfile);
          expect(call.image).toBe(mockAvatarImage);
        });

        it("should NOT render the spinner component", async () => {
          expect(
            await screen.findByTestId(mockedComponents.NavSpinner)
          ).toBeTruthy();
          expect(
            (NavSpinner as jest.Mock).mock.calls[0][0].whileTrue
          ).toBeFalsy();
        });

        it("should render the NavBarColorModeToggle", async () => {
          expect(NavBarColorModeToggle).toBeCalledTimes(1);
        });

        it("should render the menu component once", async () => {
          expect(await screen.findByTestId(testIDs.NavBarMenu));
        });

        it("should render the menu options, inside the menu", async () => {
          const menu = await screen.findByTestId(testIDs.NavBarMenu);
          within(menu).findByTestId(mockedComponents.NavBarOptions);
        });

        it("should NOT render the mobile menu", async () => {
          expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
        });

        it("should render the menu button with the right props", () => {
          expect(IconButton).toBeCalledTimes(1);
          const call = (IconButton as jest.Mock).mock.calls[0][0];
          expect(call.display).toStrictEqual({ sm: "none" });
        });
      });

      describe("with no user data", () => {
        beforeEach(() => {
          (fetchPlaceHolderHook as jest.Mock).mockReturnValue({
            isFetching: transaction,
            data: {
              avatarLink: externalLinks.defaultProfile,
              avatarImage: "",
            },
          });
          arrange(visible);
        });

        it("should render the Box component as expected", async () => {
          expect(Box).toBeCalledTimes(1);
          checkMockCall(Box, topLevelBoxProps);
        });

        it("should render the logo component with defaults", async () => {
          expect(
            await screen.findByTestId(mockedComponents.NavBarLogo)
          ).toBeTruthy();
          expect(NavBarLogo).toBeCalledTimes(1);
          const call = (NavBarLogo as jest.Mock).mock.calls[0][0];
          expect(call.href).toBe(externalLinks.defaultProfile);
          expect(call.image).toBe("");
        });

        it("should NOT render the spinner component", async () => {
          expect(
            await screen.findByTestId(mockedComponents.NavSpinner)
          ).toBeTruthy();
          expect(
            (NavSpinner as jest.Mock).mock.calls[0][0].whileTrue
          ).toBeFalsy();
        });

        it("should render the NavBarColorModeToggle", async () => {
          expect(NavBarColorModeToggle).toBeCalledTimes(1);
        });

        it("should render the menu component once", async () => {
          expect(await screen.findByTestId(testIDs.NavBarMenu));
        });

        it("should render the menu options, inside the menu", async () => {
          const menu = await screen.findByTestId(testIDs.NavBarMenu);
          within(menu).findByTestId(mockedComponents.NavBarOptions);
        });

        it("should NOT render the mobile menu", async () => {
          expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
        });

        it("should render the menu button with the right props", () => {
          expect(IconButton).toBeCalledTimes(1);
          const call = (IconButton as jest.Mock).mock.calls[0][0];
          expect(call.display).toStrictEqual({ sm: "none" });
        });
      });
    });
  });
});
