import ShortCutHash from "../shortcut";

let generator: ShortCutHash;

describe("shortCutHash", () => {
  beforeEach(() => {
    generator = new ShortCutHash();
  });

  describe("when given no starting position", () => {
    it("should return the next sequence", () => {
      expect(generator.next()).toBe("aaa");
    });

    it("should return consecutive hashes correctly", () => {
      expect(generator.next()).toBe("aaa");
      expect(generator.next()).toBe("aab");
    });
  });

  describe("when given the second hash", () => {
    beforeEach(() => generator.setCurrentHash("aab"));

    it("should return the next sequence", () => {
      expect(generator.next()).toBe("aac");
    });
  });

  describe("when given the end of lowercase characters", () => {
    beforeEach(() => generator.setCurrentHash("aaz"));

    it("should return the next sequence", () => {
      expect(generator.next()).toBe("aaA");
    });
  });

  describe("when given the end of uppercase characters", () => {
    beforeEach(() => generator.setCurrentHash("aaZ"));

    it("should return the next sequence", () => {
      expect(generator.next()).toBe("aa0");
    });
  });

  describe("when given the end of numbers", () => {
    beforeEach(() => generator.setCurrentHash("aa9"));

    it("should return the next sequence", () => {
      expect(generator.next()).toBe("aba");
    });
  });

  describe("when given the end of numbers, across 2 characters", () => {
    beforeEach(() => generator.setCurrentHash("a99"));

    it("should return the next sequence", () => {
      expect(generator.next()).toBe("baa");
    });
  });

  describe("when given the end of the entire sequence", () => {
    beforeEach(() => generator.setCurrentHash("999"));

    it("should return the next sequence", () => {
      expect(generator.next()).toBe("999b");
    });
  });
});
