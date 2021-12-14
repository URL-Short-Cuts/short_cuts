import { createMocks } from "node-mocks-http";
import apiRoutes from "../../../config/apiRoutes";
import Logger from "../endpoint.logger";
import type { APIRequest } from "../../../types/api/request";
import type { NextApiResponse } from "next";
import type { MockRequest, MockResponse } from "node-mocks-http";

describe("endpointLogger", () => {
  let req: MockRequest<APIRequest>;
  let res: MockResponse<NextApiResponse>;
  let statusCode: number;
  const next = jest.fn();
  let testRemoteAddress: string | string[] | undefined;
  const testBody = { test: "test body" };
  const testBytesRead = "300";
  const testMethod = "GET";
  const testProxyResponse = "Success!";
  const testReferer = "referred by someone";
  const testURL = apiRoutes.v1.urls;
  const testUserAgent = "test user agent";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementationOnce(() => jest.fn());
  });

  const arrange = async (
    socketDefinedRemoteAddress?: string,
    error: string | undefined = undefined
  ) => {
    ({ req: req, res: res } = createMocks<APIRequest, NextApiResponse>({
      headers: {
        referer: testReferer,
        "user-agent": testUserAgent,
        "content-length": testBytesRead,
        "x-forwarded-for": testRemoteAddress,
      },
      socket: { remoteAddress: socketDefinedRemoteAddress },
      url: testURL,
      method: testMethod,
      body: testBody,
      proxyResponse: testProxyResponse,
    }));
    if (error) req.error = error;
    res.status(statusCode);
    await Logger(req, res, next);
  };

  const returnMessage = (address: string | undefined) =>
    `${address} ${testMethod} ${testURL} ${statusCode} ${testBytesRead} ${testReferer} ${testUserAgent}`;
  const returnMessageWithError = (
    address: string | undefined,
    errors: string
  ) => `${returnMessage(address)} (${errors})`;

  describe("with a string based list of ips as the x-forwarded-header", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      testRemoteAddress = "127.0.0.1,192.168.0.1";
    });

    describe("with a socket remote address defined", () => {
      const socketTestAddress = "8.8.8.8";

      describe("when given a mock request and 200 response", () => {
        beforeEach(async () => {
          statusCode = 200;
          await arrange(socketTestAddress);
        });

        it("should log the expected message, using the socket's remote address", () => {
          const expected_log_message = returnMessage(socketTestAddress);
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(expected_log_message);
        });
      });

      describe("when given a mock request and 400 response and error", () => {
        const errorMessage = "An Error Message";

        beforeEach(async () => {
          statusCode = 400;
          await arrange(socketTestAddress, errorMessage);
          res.status(statusCode).json({ status: "error" });
        });

        it("should log the expected message, using the socket's remote address", () => {
          const expected_log_message = returnMessageWithError(
            socketTestAddress,
            errorMessage
          );
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(expected_log_message);
        });
      });
    });

    describe("with NOT socket remote address defined", () => {
      describe("when given a mock request and 200 response", () => {
        beforeEach(async () => {
          statusCode = 200;
          await arrange();
          res.status(statusCode).json({ status: "ready" });
        });

        it("should log the expected message, using the first x-forwarded header's address", () => {
          const expected_log_message = returnMessage(
            (testRemoteAddress as string).split(",")[0]
          );
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(expected_log_message);
        });
      });
    });
  });

  describe("with an array based list of ips as the x-forwarded-header", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      testRemoteAddress = ["127.0.0.1", "192.168.0.1"];
    });

    describe("with a socket remote address defined", () => {
      const socketTestAddress = "8.8.8.8";

      describe("when given a mock request and 200 response", () => {
        beforeEach(async () => {
          statusCode = 200;
          await arrange(socketTestAddress);
          res.status(statusCode).json({ status: "ready" });
        });

        it("should log the expected message, using the socket's remote address", () => {
          const expected_log_message = returnMessage(socketTestAddress);
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(expected_log_message);
        });
      });
    });

    describe("with NOT socket remote address defined", () => {
      describe("when given a mock request and 200 response", () => {
        beforeEach(async () => {
          statusCode = 200;
          await arrange();
          res.status(statusCode).json({ status: "ready" });
        });

        it("should log the expected message, using the first x-forwarded header's address", () => {
          const expected_log_message = returnMessage(
            (testRemoteAddress as string[])[0]
          );
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(expected_log_message);
        });
      });
    });
  });

  describe("with an undefined x-forwarded-header", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      testRemoteAddress = undefined;
    });

    describe("with a socket remote address defined", () => {
      const socketTestAddress = "8.8.8.8";

      describe("when given a mock request and 200 response", () => {
        beforeEach(async () => {
          statusCode = 200;
          await arrange(socketTestAddress);
          res.status(statusCode).json({ status: "ready" });
        });

        it("should log the expected message, using the socket's remote address", () => {
          const expected_log_message = returnMessage(socketTestAddress);
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(expected_log_message);
        });
      });
    });

    describe("with NOT socket remote address defined", () => {
      describe("when given a mock request and 200 response", () => {
        beforeEach(async () => {
          statusCode = 200;
          await arrange();
          res.status(statusCode).json({ status: "ready" });
        });

        it("should log the expected message, simply stating undefined for the remote ip address", () => {
          const expected_log_message = returnMessage(undefined);
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(expected_log_message);
        });
      });
    });
  });
});
