import { createMocks } from "node-mocks-http";
import * as status from "../../../../config/status";
import IntegrationError from "../../../integrations/integration.error.class";
import EndpointFactoryBase from "../endpoint.url.base.class";
import type { HttpMethodType } from "../../../../types/general/http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextConnect } from "next-connect";
import type { MockRequest, MockResponse } from "node-mocks-http";

class ConcretePostClass extends EndpointFactoryBase {
  route = "/api/v1/endpoint";
  methods = ["POST" as const];

  attachPostHandler(baseHandler: NextConnect<NextApiRequest, NextApiResponse>) {
    baseHandler.post(this.route, async (req, res, next) => {
      res.status(200).json(status.STATUS_200_MESSAGE);
      next();
    });
  }
}

class ConcreteErrorPostClass extends EndpointFactoryBase {
  route = "/api/v1/endpoint";
  methods = ["POST" as const];
  mockError = "mockError";
  errorCode?: number;

  attachPostHandler(baseHandler: NextConnect<NextApiRequest, NextApiResponse>) {
    baseHandler.post(this.route, async () => {
      throw new IntegrationError(this.mockError, this.errorCode);
    });
  }
}

class ConcreteGetClass extends EndpointFactoryBase {
  route = "/api/v1/endpoint";
  methods = ["GET" as const];

  attachGetHandler(baseHandler: NextConnect<NextApiRequest, NextApiResponse>) {
    baseHandler.get(this.route, async (req, res, next) => {
      res.status(200).json(status.STATUS_200_MESSAGE);
      next();
    });
  }
}

class ConcreteErrorGetClass extends EndpointFactoryBase {
  route = "/api/v1/endpoint";
  methods = ["GET" as const];
  mockError = "mockError";
  errorCode?: number;

  attachGetHandler(baseHandler: NextConnect<NextApiRequest, NextApiResponse>) {
    baseHandler.get(this.route, async () => {
      throw new IntegrationError(this.mockError, this.errorCode);
    });
  }
}

jest.mock("../../endpoint.logger.ts", () => {
  return jest.fn((req, res, next) => next());
});

describe("EndpointFactoryBase", () => {
  let req: MockRequest<NextApiRequest>;
  let res: MockResponse<NextApiResponse>;
  let payload: undefined | Record<string, string>;
  let factory: EndpointFactoryBase;
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

  describe("postIntegration", () => {
    it("should return the default message", () => {
      const factory = new ConcretePostClass();
      expect(factory.postIntegration("mockArg")).resolves.toStrictEqual({
        error: "Not Implemented.",
      });
    });
  });

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
          factory = new ConcretePostClass();
          await arrange();
        });

        it("should return a 200", () => {
          expect(res._getStatusCode()).toBe(200);
          expect(res._getJSONData()).toStrictEqual(status.STATUS_200_MESSAGE);
        });
      });

      describe("receives a request that generates an unknown integration error", () => {
        beforeEach(async () => {
          factory = new ConcreteErrorPostClass();
          await arrange();
        });

        it("should return a 502", () => {
          expect(res._getStatusCode()).toBe(502);
          expect(res._getJSONData()).toStrictEqual(status.STATUS_502_MESSAGE);
        });
      });

      describe("receives a request that generates a validation error", () => {
        beforeEach(async () => {
          factory = new ConcreteErrorPostClass();
          (factory as ConcreteErrorPostClass).errorCode = 400;
          await arrange();
        });

        it("should return a 400", () => {
          expect(res._getStatusCode()).toBe(400);
          expect(res._getJSONData()).toStrictEqual(status.STATUS_400_MESSAGE);
        });
      });

      describe("receives a request that generates an rate limited integration error", () => {
        beforeEach(async () => {
          factory = new ConcreteErrorPostClass();
          (factory as ConcreteErrorPostClass).errorCode = 429;
          await arrange();
        });

        it("should return a 429", () => {
          expect(res._getStatusCode()).toBe(429);
          expect(res._getJSONData()).toStrictEqual(status.STATUS_429_MESSAGE);
        });
      });
    });
  });

  describe("getIntegration", () => {
    it("should return the default message", () => {
      const factory = new ConcreteGetClass();
      expect(factory.getIntegration("mockArg")).resolves.toStrictEqual({
        error: "Not Implemented.",
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
        factory = new ConcreteGetClass();
        await arrange();
      });

      it("should return a 200", () => {
        expect(res._getStatusCode()).toBe(200);
        expect(res._getJSONData()).toStrictEqual(status.STATUS_200_MESSAGE);
      });
    });

    describe("receives a request that generates an not found error", () => {
      beforeEach(async () => {
        factory = new ConcreteErrorGetClass();
        (factory as ConcreteErrorGetClass).errorCode = 404;
        await arrange();
      });

      it("should return a 404", () => {
        expect(res._getStatusCode()).toBe(404);
        expect(res._getJSONData()).toStrictEqual(status.STATUS_404_MESSAGE);
      });
    });

    describe("receives a request that generates an unknown integration error", () => {
      beforeEach(async () => {
        factory = new ConcreteErrorGetClass();
        await arrange();
      });

      it("should return a 502", () => {
        expect(res._getStatusCode()).toBe(502);
        expect(res._getJSONData()).toStrictEqual(status.STATUS_502_MESSAGE);
      });
    });

    describe("receives a request that generates an rate limited integration error", () => {
      beforeEach(async () => {
        factory = new ConcreteErrorGetClass();
        (factory as ConcreteErrorGetClass).errorCode = 429;
        await arrange();
      });

      it("should return a 429", () => {
        expect(res._getStatusCode()).toBe(429);
        expect(res._getJSONData()).toStrictEqual(status.STATUS_429_MESSAGE);
      });
    });
  });

  describe("with a POST request on the GET endpoint", () => {
    beforeEach(() => {
      method = "POST" as const;
    });

    describe("with a random payload", () => {
      beforeEach(async () => {
        payload = { random: "random" };
      });

      describe("receives a request", () => {
        beforeEach(async () => {
          factory = new ConcreteGetClass();
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
