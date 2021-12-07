import { createMocks } from "node-mocks-http";
import * as status from "../../../../config/status";
import { IntegrationError } from "../../endpoint.integration.error.class";
import BaseClass from "../endpoint.url.base.class";
import type { HttpMethodType } from "../../../../types/general/http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { MockRequest, MockResponse } from "node-mocks-http";

class ConcreteClass extends BaseClass {
  route = "/api/v1/endpoint";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  externalIntegration(_: string): Record<string, string> {
    return status.STATUS_200_MESSAGE;
  }
}

class ConcreteErrorClass extends BaseClass {
  route = "/api/v1/endpoint";
  mockError = "mockError";
  errorCode?: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  externalIntegration(_: string): Record<string, string> {
    throw new IntegrationError(this.mockError, this.errorCode);
  }
}

jest.mock("../../endpoint.logger.ts", () => {
  return jest.fn((req, res, next) => next());
});

describe("EndpointBaseClass", () => {
  let req: MockRequest<NextApiRequest>;
  let res: MockResponse<NextApiResponse>;
  let payload: undefined | Record<string, string>;
  let factory: ConcreteClass | ConcreteErrorClass;
  let method: HttpMethodType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async () => {
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: factory.route,
      method,
      body: payload,
    }));
    await factory.create()(req, res);
  };

  describe("with a POST request", () => {
    beforeEach(() => {
      method = "POST" as const;
    });

    describe("with a valid payload", () => {
      beforeEach(() => {
        payload = { url: "http://yahoo.com" };
      });

      describe("receives a request that is processed correctly", () => {
        beforeEach(async () => {
          factory = new ConcreteClass();
          await arrange();
        });

        it("should return a 200", () => {
          expect(res._getStatusCode()).toBe(200);
          expect(res._getJSONData()).toStrictEqual(status.STATUS_200_MESSAGE);
        });
      });

      describe("receives a request that generates an unknown proxy error", () => {
        beforeEach(async () => {
          factory = new ConcreteErrorClass();
          await arrange();
        });

        it("should return a 502", () => {
          expect(res._getStatusCode()).toBe(502);
          expect(res._getJSONData()).toStrictEqual(status.STATUS_502_MESSAGE);
        });
      });

      describe("receives a request that generates an rate limited proxy error", () => {
        beforeEach(async () => {
          factory = new ConcreteErrorClass();
          (factory as ConcreteErrorClass).errorCode = 429;
          await arrange();
        });

        it("should return a 429", () => {
          expect(res._getStatusCode()).toBe(429);
          expect(res._getJSONData()).toStrictEqual(status.STATUS_429_MESSAGE);
        });
      });
    });

    describe("with an invalid payload", () => {
      beforeEach(() => {
        payload = { url: "http://localhost" };
      });

      describe("receives a request", () => {
        beforeEach(async () => {
          factory = new ConcreteClass();
          await arrange();
        });

        it("should return a 400", () => {
          expect(res._getStatusCode()).toBe(400);
          expect(res._getJSONData()).toStrictEqual(status.STATUS_400_MESSAGE);
        });
      });
    });

    describe("with no data", () => {
      beforeEach(async () => {
        payload = { incorrectField: "localhost" };
      });

      describe("receives a request", () => {
        beforeEach(async () => {
          factory = new ConcreteClass();
          await arrange();
        });

        it("should return a 400", () => {
          expect(res._getStatusCode()).toBe(400);
          expect(res._getJSONData()).toStrictEqual(status.STATUS_400_MESSAGE);
        });
      });
    });
  });

  describe("with a PUT request", () => {
    beforeEach(() => {
      method = "PUT" as const;
    });

    describe("with a random payload", () => {
      beforeEach(async () => {
        payload = { random: "random" };
      });

      describe("receives a request", () => {
        beforeEach(async () => {
          factory = new ConcreteClass();
          await arrange();
        });

        it("should return a 405", () => {
          expect(res._getStatusCode()).toBe(405);
          expect(res._getJSONData()).toStrictEqual(status.STATUS_405_MESSAGE);
        });
      });
    });
  });
});
