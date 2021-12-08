import ShortCutHash from "../shortcut";

describe("shortCutHash", () => {
  let input: string;

  describe("when given no starting position", () => {
    it("should return the next sequence", () => {
      const generator = new ShortCutHash();
      expect(generator.next()).toBe("aab");
    });
  });

  describe("when given the second hash", () => {
    beforeEach(() => (input = "aab"));

    it("should return the next sequence", () => {
      const generator = new ShortCutHash(input);
      expect(generator.next()).toBe("aac");
    });
  });

  describe("when given the end of lowercase characters", () => {
    beforeEach(() => (input = "aaz"));

    it("should return the next sequence", () => {
      const generator = new ShortCutHash(input);
      expect(generator.next()).toBe("aaA");
    });
  });

  describe("when given the end of uppercase characters", () => {
    beforeEach(() => (input = "aaZ"));

    it("should return the next sequence", () => {
      const generator = new ShortCutHash(input);
      expect(generator.next()).toBe("aa1");
    });
  });

  describe("when given the end of numbers", () => {
    beforeEach(() => (input = "aa9"));

    it("should return the next sequence", () => {
      const generator = new ShortCutHash(input);
      expect(generator.next()).toBe("ab9");
    });
  });

  describe("when given the end of numbers, across 2 characters", () => {
    beforeEach(() => (input = "a99"));

    it("should return the next sequence", () => {
      const generator = new ShortCutHash(input);
      expect(generator.next()).toBe("b99");
    });
  });

  describe("when given the end of the entire sequence", () => {
    beforeEach(() => (input = "999"));

    it("should return the next sequence", () => {
      const generator = new ShortCutHash(input);
      expect(generator.next()).toBe("aaa");
    });
  });
});
