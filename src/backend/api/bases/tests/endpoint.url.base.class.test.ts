import { createMocks } from "node-mocks-http";
import * as status from "../../../../config/status";
import IntegrationError from "../../../integrations/integration.error.class";
import UrlEndpointFactoryBase from "../endpoint.url.base.class";
import type { HttpMethodType } from "../../../../types/general/http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { MockRequest, MockResponse } from "node-mocks-http";

class ConcreteClass extends UrlEndpointFactoryBase {
  route = "/api/v1/endpoint";
  methods = ["POST" as const, "GET" as const];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async postIntegration(_: string): Promise<Record<string, string>> {
    return status.STATUS_200_MESSAGE;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getIntegration(_: string): Promise<Record<string, string>> {
    return { url: "http://yahoo.com" };
  }
}

class ConcreteErrorClass extends UrlEndpointFactoryBase {
  route = "/api/v1/endpoint";
  methods = ["POST" as const, "GET" as const];
  mockError = "mockError";
  errorCode?: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async postIntegration(_: string): Promise<Record<string, string>> {
    throw new IntegrationError(this.mockError, this.errorCode);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getIntegration(_: string): Promise<Record<string, string>> {
    throw new IntegrationError(this.mockError, this.errorCode);
  }
}

jest.mock("../../endpoint.logger.ts", () => {
  return jest.fn((req, res, next) => next());
});

describe("UrlEndpointFactoryBase", () => {
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

        it("should return a 201", () => {
          expect(res._getStatusCode()).toBe(201);
          expect(res._getJSONData()).toStrictEqual(status.STATUS_200_MESSAGE);
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

  describe("with a GET request", () => {
    beforeEach(() => {
      method = "GET" as const;
      payload = undefined;
    });

    describe("receives a request that is processed correctly", () => {
      beforeEach(async () => {
        factory = new ConcreteClass();
        await arrange();
      });

      it("should return a 200", () => {
        expect(res._getStatusCode()).toBe(200);
        expect(res._getJSONData()).toStrictEqual({ url: "http://yahoo.com" });
      });
    });

    describe("receives a request that errors", () => {
      beforeEach(async () => {
        factory = new ConcreteErrorClass();
        (factory as ConcreteErrorClass).errorCode = 404;
        await arrange();
      });

      it("should return a 404", () => {
        expect(res._getStatusCode()).toBe(404);
        expect(res._getJSONData()).toStrictEqual(status.STATUS_404_MESSAGE);
      });
    });
  });
});
