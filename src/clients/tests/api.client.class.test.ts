import * as status from "../../config/status";
import APIClient from "../api.client.class";

describe("APIClient", () => {
  const client = new APIClient();
  const remoteSite = "https://remotesite.com/";
  const postContent = { info: "Love this website!" };
  type responseType = { success: boolean };
  const mockFetchParams = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "same-origin",
    body: JSON.stringify(postContent),
  };

  beforeAll(() => {
    jest.spyOn(window, "fetch");
  });

  afterAll(() => jest.restoreAllMocks());

  afterEach(() => jest.clearAllMocks());

  const setupFetch = (
    {
      success,
      status,
    }: {
      success: boolean;
      status: number;
    },
    headers: [string, string][] = []
  ) => {
    (window.fetch as jest.Mock).mockResolvedValueOnce({
      status,
      headers,
      url: remoteSite,
      ok: success,
      json: async () => ({ success }),
    });
  };

  describe("post", () => {
    const arrange = () => {
      return client.post<typeof postContent, responseType>(
        remoteSite,
        postContent
      );
    };

    describe("when an 'ok' status is returned", () => {
      beforeEach(() =>
        setupFetch({
          success: true,
          status: 200,
        })
      );

      it("should call the underlying fetch function correctly", async () => {
        await arrange();
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith(remoteSite, mockFetchParams);
      });

      it("should return a success message", async () => {
        const response = await arrange();
        expect(response).toStrictEqual({
          status: 200,
          headers: {},
          response: { success: true },
        });
      });
    });

    describe("when a '404' status code is returned", () => {
      beforeEach(() => setupFetch({ success: false, status: 404 }));

      it("should call the underlying fetch function correctly", () => {
        arrange();
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith(remoteSite, mockFetchParams);
      });

      it("should return the correct error message", async () => {
        const response = await arrange();
        expect(response).toStrictEqual({
          status: 404,
          headers: {},
          response: status.STATUS_404_MESSAGE,
        });
      });
    });

    describe("when a '429' status code is returned", () => {
      beforeEach(() =>
        setupFetch({ success: false, status: 429 }, [["retry-after", "0"]])
      );

      it("should call the underlying fetch function correctly", () => {
        arrange();
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith(remoteSite, mockFetchParams);
      });

      it("should return the correct error message", async () => {
        const response = await arrange();
        expect(response).toStrictEqual({
          status: 429,
          headers: { "retry-after": "0" },
          response: status.STATUS_429_MESSAGE,
        });
      });
    });
  });
});
