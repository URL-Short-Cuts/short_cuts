import { isValidUrl, maximumLength } from "../urls";

describe("isValidUrl", () => {
  let input: string;

  describe("when given a valid url", () => {
    beforeEach(() => (input = "https://yahoo.com"));

    it("should return true", () => {
      expect(isValidUrl(input)).toBeTruthy();
    });
  });

  describe("when given an url that's too long", () => {
    beforeEach(() => (input = `https://yahoo${"a".repeat(maximumLength)}.com`));

    it("should return true", () => {
      expect(isValidUrl(input)).toBeFalsy();
    });
  });

  describe("when given an invalid url", () => {
    beforeEach(() => (input = "localhost"));

    it("should return true", () => {
      expect(isValidUrl(input)).toBeFalsy();
    });
  });
});
