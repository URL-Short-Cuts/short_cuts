import { createMocks } from "node-mocks-http";
import apiRoutes from "../../../../../config/apiRoutes";
import handler from "../../../../../pages/api/v1/hello";
import type { HttpMethodType } from "../../../../../types/utils/http.d";
import type { NextApiRequest, NextApiResponse } from "next";
import type { MockRequest, MockResponse } from "node-mocks-http";

type ArrangeArgs = {
  body?: Record<string, unknown>;
  method: HttpMethodType;
};

describe(apiRoutes.v1.hello, () => {
  let req: MockRequest<NextApiRequest>;
  let res: MockResponse<NextApiResponse>;
  const mockResponse = { name: "John Doe", detail: "OK" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async ({ body, method = "POST" }: ArrangeArgs) => {
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: apiRoutes.v1.hello,
      method,
      body,
    }));
    handler(req, res);
  };

  describe("when a GET request is sent", () => {
    beforeEach(async () => {
      await arrange({ method: "GET" });
    });

    it("should return a 200 status code", () => {
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toStrictEqual(mockResponse);
    });
  });
});
