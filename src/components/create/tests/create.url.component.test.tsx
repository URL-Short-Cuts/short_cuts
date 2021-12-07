import { render } from "@testing-library/react";
import Create from "../create.url.component";

describe("CreateURL", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<Create url={"http://yahoo.com"} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should render the placeholder component without errors", () => {
      // Nothing to see here
    });
  });
});
