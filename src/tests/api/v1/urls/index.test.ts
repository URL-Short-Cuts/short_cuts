import { createMocks } from "node-mocks-http";
import apiRoutes from "../../../../config/apiRoutes";
import handleProxy from "../../../../pages/api/v1/urls/index";
import type { HttpMethodType } from "../../../../types/general/http.d";
import type { NextApiRequest, NextApiResponse } from "next";
import type { MockRequest, MockResponse } from "node-mocks-http";

jest.mock("../../../../backend/integrations/integration.dynamodb.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getNextFreeHash: mockDatabaseResponse,
    };
  });
});

jest.mock("../../../../backend/integrations/integration.s3.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      writeUrl: mockS3Response,
    };
  });
});

jest.mock("../../../../backend/api/endpoint.logger", () => {
  return jest.fn((req, res, next) => next());
});

const mockDatabaseResponse = jest.fn();
const mockS3Response = jest.fn();

type ArrangeArgs = {
  body: Record<string, unknown>;
  method: HttpMethodType;
};

describe(apiRoutes.v1.urls, () => {
  let req: MockRequest<NextApiRequest>;
  let res: MockResponse<NextApiResponse>;
  const mockDatabaseResponseValue = "aaa";
  let payload: Record<string, string>;
  let method: HttpMethodType;
  let original: typeof process.env;
  const mockHostname = "http://shortcuts:3000";

  beforeAll(() => {
    original = process.env;
    process.env.HOSTNAME = mockHostname;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    process.env = original;
  });

  const arrange = async ({ body, method = "POST" }: ArrangeArgs) => {
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: apiRoutes.v1.urls,
      method,
      body,
    }));
    await handleProxy(req, res);
  };

  describe("with valid data", () => {
    const mockUrl = "http://www.yahoo.com";

    beforeEach(() => {
      payload = { url: mockUrl };
    });

    describe("receives a POST request", () => {
      beforeEach(() => {
        method = "POST" as const;
      });

      describe("with a valid response", () => {
        beforeEach(async () => {
          mockDatabaseResponse.mockReturnValueOnce(
            Promise.resolve(mockDatabaseResponseValue)
          );
          await arrange({ body: payload, method });
        });

        it("should return a 200 status code", () => {
          expect(res._getStatusCode()).toBe(200);
          expect(res._getJSONData()).toStrictEqual({
            url: mockHostname + "/" + mockDatabaseResponseValue,
          });
        });

        it("should call the database integration with the correct params", () => {
          expect(mockDatabaseResponse).toBeCalledWith();
        });

        it("should call the database integration with the correct params", () => {
          expect(mockS3Response).toBeCalledWith(
            mockDatabaseResponseValue,
            mockUrl
          );
        });
      });
    });
  });
});
