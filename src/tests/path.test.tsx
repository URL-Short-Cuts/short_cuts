import { createMocks } from "node-mocks-http";
import apiRoutes from "../config/apiRoutes";
import routes from "../config/routes";
import Page, { getServerSideProps } from "../pages/[...path]";
import type {
  GetServerSidePropsContext,
  Redirect,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { MockRequest, MockResponse } from "node-mocks-http";

describe("getServerSideProps", () => {
  let req: MockRequest<NextApiRequest>;
  let res: MockResponse<NextApiResponse>;
  const mockUrl = "http://yahoo.com";
  const mockHost = "http://localhost:3000";
  const mockHash = "aaa";
  let context: GetServerSidePropsContext;
  let serverResponse: { redirect: Redirect };
  const originalEnvHOSTNAME = process.env.HOSTNAME;

  beforeAll(() => {
    jest.spyOn(window, "fetch");
    process.env.HOSTNAME = mockHost;
  });

  afterAll(() => {
    jest.restoreAllMocks();
    process.env.HOSTNAME = originalEnvHOSTNAME;
  });

  afterEach(() => jest.clearAllMocks());

  const setupFetch = (
    {
      response,
      path,
      status,
    }: {
      response: Record<string, string>;
      path: string;
      status: number;
    },
    headers: [string, string][] = []
  ) => {
    (window.fetch as jest.Mock).mockResolvedValueOnce({
      status,
      headers,
      url: mockHost + "/" + path,
      json: async () => response,
    });
  };

  describe("when called with a valid path", () => {
    beforeEach(() => {
      ({
        req: req,
        res,
        res,
      } = createMocks<NextApiRequest, NextApiResponse>({
        url: apiRoutes.v1.urls + "/:id",
        method: "GET",
      }));
      context = {
        query: { path: [mockHash] },
        req,
        res,
        resolvedUrl: apiRoutes.v1.urls + "/:id",
      };
    });

    describe("with successful api request", () => {
      beforeEach(async () => {
        setupFetch({ response: { url: mockUrl }, path: mockHash, status: 200 });
        serverResponse = (await getServerSideProps(context)) as {
          redirect: Redirect;
        };
      });

      it("should return the expected response", () => {
        expect(serverResponse).toStrictEqual({
          redirect: {
            statusCode: 301,
            destination: mockUrl,
          },
        });
      });

      it("should call fetch with the expected props", () => {
        expect(window.fetch).toBeCalledTimes(1);
        expect(window.fetch).toBeCalledWith(
          mockHost + apiRoutes.v1.urls + "/" + mockHash
        );
      });
    });

    describe("with an unsuccessful api request", () => {
      beforeEach(async () => {
        setupFetch({ response: { url: mockUrl }, path: mockHash, status: 404 });
        serverResponse = (await getServerSideProps(context)) as {
          redirect: Redirect;
        };
      });

      it("should return the expected response", () => {
        expect(serverResponse).toStrictEqual({
          redirect: {
            destination: routes[404],
            statusCode: 302,
          },
        });
      });

      it("should call fetch with the expected props", () => {
        expect(window.fetch).toBeCalledTimes(1);
        expect(window.fetch).toBeCalledWith(
          mockHost + apiRoutes.v1.urls + "/" + mockHash
        );
      });
    });
  });

  describe("when called without a path", () => {
    beforeEach(() => {
      ({
        req: req,
        res,
        res,
      } = createMocks<NextApiRequest, NextApiResponse>({
        url: apiRoutes.v1.urls + "/:id",
        method: "GET",
      }));
      context = {
        query: { path: [] },
        req,
        res,
        resolvedUrl: apiRoutes.v1.urls + "/:id",
      };
    });

    describe("with an unsuccessful api request", () => {
      beforeEach(async () => {
        setupFetch({
          response: { url: mockUrl },
          path: mockHash,
          status: 404,
        });
        serverResponse = (await getServerSideProps(context)) as {
          redirect: Redirect;
        };
      });

      it("should return the expected response", () => {
        expect(serverResponse).toStrictEqual({
          redirect: {
            destination: routes[404],
            statusCode: 302,
          },
        });
      });

      it("should call fetch with the expected props", () => {
        expect(window.fetch).toBeCalledTimes(1);
        expect(window.fetch).toBeCalledWith(
          mockHost + apiRoutes.v1.urls + "/_"
        );
      });
    });
  });
});

describe("CatchAllPath", () => {
  const arrange = () => {
    return Page();
  };

  it("should return null", () => {
    expect(arrange()).toBeNull();
  });
});
