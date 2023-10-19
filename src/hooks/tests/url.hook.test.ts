import { renderHook, act } from "@testing-library/react";
import dk from "deep-keys";
import mockUrlHook from "./url.hook.mock";
import ApiClient from "../../clients/api.client.class";
import routes from "../../config/apiRoutes";
import * as status from "../../config/status";
import Events from "../../events/events";
import mockAnalyticsHook from "../../hooks/tests/analytics.mock.hook";
import useUrl from "../url";

jest.mock("../../clients/api.client.class");

jest.mock("../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

describe("useUrl", () => {
  let originalEnvironment: typeof process.env;
  let received: ReturnType<typeof arrange>;
  const mockUrl = "http://yahoo.com";
  const mockCreatedUrl = "http://shortcut/short";
  const mockPost = jest.fn();

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const arrange = () => {
    (ApiClient as jest.Mock).mockImplementationOnce(() => ({
      post: mockPost,
    }));
    return renderHook(() => useUrl());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockUrlHook).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    describe("when createUrl is called", () => {
      describe("with a successful operation", () => {
        beforeEach(async () => {
          mockPost.mockReturnValue({
            response: { url: mockCreatedUrl },
            status: 200,
          });
          await act(() => received.result.current.createUrl(mockUrl));
        });

        it("should generate the correct analytics event", () => {
          expect(mockAnalyticsHook.event).toBeCalledTimes(2);
          expect(mockAnalyticsHook.event).nthCalledWith(1, Events.URL.Request);
          expect(mockAnalyticsHook.event).nthCalledWith(2, Events.URL.Success);
        });

        it("should call the api client as expected", () => {
          expect(mockPost).toBeCalledTimes(1);
          expect(mockPost).toBeCalledWith(routes.v1.urls, { url: mockUrl });
        });

        it("should update the hook properties as expected", () => {
          expect(mockPost).toBeCalledTimes(1);
          expect(received.result.current.status).toBe(200);
          expect(received.result.current.created).toBe(mockCreatedUrl);
        });
      });

      describe("with an unsuccessful operation", () => {
        beforeEach(async () => {
          mockPost.mockReturnValue({
            response: status.STATUS_429_MESSAGE,
            status: 429,
          });
          await act(() => received.result.current.createUrl(mockUrl));
        });

        it("should generate the correct analytics event", () => {
          expect(mockAnalyticsHook.event).toBeCalledTimes(2);
          expect(mockAnalyticsHook.event).nthCalledWith(1, Events.URL.Request);
          expect(mockAnalyticsHook.event).nthCalledWith(2, Events.URL.Error);
        });

        it("should call the api client as expected", () => {
          expect(mockPost).toBeCalledTimes(1);
          expect(mockPost).toBeCalledWith(routes.v1.urls, { url: mockUrl });
        });

        it("should update the hook properties as expected", () => {
          expect(mockPost).toBeCalledTimes(1);
          expect(received.result.current.status).toBe(429);
          expect(received.result.current.created).toBe(null);
        });
      });
    });

    describe("when resetCreateUrl is called", () => {
      describe("after a successful operation", () => {
        beforeEach(async () => {
          mockPost.mockReturnValue({
            response: { url: mockCreatedUrl },
            status: 200,
          });
          await act(async () => received.result.current.createUrl(mockUrl));
          act(() => received.result.current.resetCreateUrl());
        });

        it("should update the hook properties to defaults", () => {
          expect(mockPost).toBeCalledTimes(1);
          expect(received.result.current.status).toBe(null);
          expect(received.result.current.created).toBe(null);
        });
      });
    });
  });
});
