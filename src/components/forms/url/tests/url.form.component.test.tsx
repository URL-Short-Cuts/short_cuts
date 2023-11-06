import { Flex } from "@chakra-ui/react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import StyledButton from "../../../button/button.standard/button.standard.component";
import FormComponent from "../url.form.component";

jest.mock("next/router", () => jest.requireActual("next-router-mock"));

jest.mock("../../../button/button.standard/button.standard.component", () => {
  const Original = jest.requireActual(
    "../../../button/button.standard/button.standard.component"
  ).default;
  return jest.fn((props) => <Original {...props} />);
});

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Flex"]);
});

describe("FormComponent", () => {
  beforeEach(() => jest.clearAllMocks());

  const mockT = jest.fn((arg: string) => `t(${arg})`);
  const mockValidate = jest.fn();
  const mockSubmit = jest.fn();

  const arrange = () => {
    render(
      <FormComponent
        t={mockT}
        validateURL={mockValidate}
        handleSubmit={mockSubmit}
      />
    );
  };

  it("should call Flex as expected to center content", () => {
    arrange();
    expect(Flex).toBeCalledTimes(1);
    checkMockCall(Flex, { justify: "center", maxWidth: "700px" });
  });

  it("should display the correct url field label", async () => {
    arrange();
    expect(
      await screen.findByText("t(url.fields.url.fieldLabel)")
    ).toBeTruthy();
  });

  it("should display the correct url placeholder text", async () => {
    arrange();
    expect(
      await screen.findByPlaceholderText("t(url.fields.url.fieldPlaceHolder)")
    ).toBeTruthy();
  });

  it("should display the correct button text", async () => {
    arrange();
    expect(await screen.findByText("t(url.buttonText)")).toBeTruthy();
  });

  it("should call StyledInput once", async () => {
    arrange();
    const inputField = (await screen.findByPlaceholderText(
      "t(url.fields.url.fieldPlaceHolder)"
    )) as HTMLInputElement & { ref: string };
    expect(inputField.id).toBe("url");
    expect(inputField.placeholder).toBe("t(url.fields.url.fieldPlaceHolder)");
  });

  it("should call Button with the correct props", async () => {
    arrange();
    expect(StyledButton).toBeCalledTimes(1);
    checkMockCall(StyledButton, {
      width: ["50px", "100px", "100px"],
      analyticsName: "URL: generate shortcut",
      isLoading: false,
      mb: 12,
      mt: 8,
      ml: 3,
      type: "submit",
    });
  });

  describe("when text is entered", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockValidate.mockImplementation(() => undefined);
      arrange();
      const input = await screen.findByPlaceholderText(
        "t(url.fields.url.fieldPlaceHolder)"
      );
      await waitFor(() => {
        fireEvent.change(input, { target: { value: "field_value" } });
      });
    });

    describe("when submit is pressed", () => {
      let button: HTMLElement;

      beforeEach(async () => {
        button = await screen.findByText("t(url.buttonText)");
        await waitFor(() => {
          fireEvent.focus(button);
          fireEvent.click(button);
        });
      });

      it("should call the handleSubmit function as expected", () => {
        expect(mockValidate).toBeCalledTimes(2);
        expect(mockSubmit).toBeCalledTimes(1);
      });
    });
  });
});
