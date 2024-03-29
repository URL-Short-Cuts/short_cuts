import { render, screen } from "@testing-library/react";
import BackGround from "../../../components/background/background.component";
import checkMockCall from "../../../tests/fixtures/mock.component.call";
import UserInterfaceChakraProvider from "../ui.chakra/ui.chakra.provider";
import UserInterfaceImagesProvider from "../ui.images/ui.images.provider";
import UserInterfacePopUpsProvider from "../ui.popups/ui.popups.provider";
import UserInterfaceRootProvider from "../ui.root.provider";

jest.mock("../../../components/background/background.component", () =>
  require("../../../tests/fixtures/mock.component.children.factory.class").factoryInstance.create(
    "BackGround"
  )
);

jest.mock("../ui.chakra/ui.chakra.provider", () =>
  require("../../../tests/fixtures/mock.component.children.factory.class").factoryInstance.create(
    "UserInterfaceChakraProvider"
  )
);

jest.mock("../ui.popups/ui.popups.provider", () =>
  require("../../../tests/fixtures/mock.component.children.factory.class").factoryInstance.create(
    "UserInterfacePopUpsProvider"
  )
);

jest.mock("../ui.images/ui.images.provider", () =>
  require("../../../tests/fixtures/mock.component.children.factory.class").factoryInstance.create(
    "UserInterfaceImagesProvider"
  )
);

describe("UserInterfaceRootProvider", () => {
  const mockChildComponent = "MockChildComponent";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(
      <UserInterfaceRootProvider>
        <div>{mockChildComponent}</div>
      </UserInterfaceRootProvider>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call BackGround with the correct props", () => {
      expect(BackGround).toBeCalledTimes(1);
      checkMockCall(BackGround, {});
    });

    it("should call UserInterfaceChakraProvider with the correct props", () => {
      expect(UserInterfaceChakraProvider).toBeCalledTimes(1);
      checkMockCall(UserInterfaceChakraProvider, {});
    });

    it("should call UserInterfacePopupProvider with the correct props", () => {
      expect(UserInterfacePopUpsProvider).toBeCalledTimes(1);
      checkMockCall(UserInterfacePopUpsProvider, {});
    });

    it("should call UserInterfaceImagesProvider with the correct props", () => {
      expect(UserInterfaceImagesProvider).toBeCalledTimes(1);
      checkMockCall(UserInterfaceImagesProvider, {});
    });

    it("should return the mock child component", async () => {
      expect(await screen.findByText(mockChildComponent)).toBeTruthy();
    });
  });
});
