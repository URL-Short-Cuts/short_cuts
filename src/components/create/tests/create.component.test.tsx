import { render } from "@testing-library/react";
import Dialogue from "../../dialogues/resizable/dialogue.resizable.component";
import CreateComponent from "../create.component";
import FooterComponent from "../inlays/create.footer.component";

jest.mock("../../dialogues/resizable/dialogue.resizable.component", () =>
  jest.fn(() => <div>MockDialogue</div>)
);

describe("About", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<CreateComponent url={"mockValue"} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Dialogue as expected", () => {
      expect(Dialogue).toBeCalledTimes(1);
      const call = (Dialogue as jest.Mock).mock.calls[0][0];
      expect(typeof call.t).toBe("function");
      expect(call.titleKey).toBe("title");
      expect(typeof call.HeaderComponent).toBe("function");
      expect(typeof call.BodyComponent).toBe("function");
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(typeof call.ToggleComponent).toBe("function");
    });
  });
});
