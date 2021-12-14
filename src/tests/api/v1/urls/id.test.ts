import { createMocks } from "node-mocks-http";
import apiRoutes from "../../../../config/apiRoutes";
import handleProxy from "../../../../pages/api/v1/urls/[id]";
import type { HttpMethodType } from "../../../../types/general/http.d";
import type { NextApiRequest, NextApiResponse } from "next";
import type { MockRequest, MockResponse } from "node-mocks-http";

jest.mock("../../../../backend/integrations/integration.s3.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      readUrl: mockS3Response,
    };
  });
});

jest.mock("../../../../backend/api/endpoint.logger", () => {
  return jest.fn((req, res, next) => next());
});

const mockS3Response = jest.fn();

type ArrangeArgs = {
  path: string;
  method: HttpMethodType;
};

describe(apiRoutes.v1.urls + "/:id", () => {
  let req: MockRequest<NextApiRequest>;
  let res: MockResponse<NextApiResponse>;
  const mockHash = "aaa";
  let method: HttpMethodType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async ({ path, method = "GET" }: ArrangeArgs) => {
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: apiRoutes.v1.urls + "/:id",
      method,
    }));
    req.query.id = path;
    await handleProxy(req, res);
  };

  describe("with valid data", () => {
    const mockUrl = "http://www.yahoo.com";
    let mockPath: string;

    beforeEach(() => {
      mockPath = mockHash;
    });

    describe("receives a GET request", () => {
      beforeEach(() => {
        method = "GET" as const;
      });

      describe("with a valid response", () => {
        beforeEach(async () => {
          mockS3Response.mockReturnValueOnce({ url: mockUrl });

          await arrange({ path: mockPath, method });
        });

        it("should return a 200 status code", () => {
          expect(res._getStatusCode()).toBe(301);
          expect(res._getRedirectUrl()).toBe(mockUrl);
        });

        it("should call the database integration with the correct params", () => {
          expect(mockS3Response).toBeCalledWith(mockHash);
        });
      });
    });
  });
});
