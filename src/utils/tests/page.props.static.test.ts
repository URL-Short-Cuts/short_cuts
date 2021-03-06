import pagePropsGenerator from "../page.props.static";

jest.mock("next-i18next/serverSideTranslations", () => {
  return {
    serverSideTranslations: (locale: string, translations: string[]) =>
      Promise.resolve({
        i18NextProps: {
          locale,
          translations,
        },
      }),
  };
});

interface mockReturnValueType {
  props: {
    i18NextProps: {
      locale: string;
      translations: string[];
    };
    headerProps: { pageKey: string };
  };
}

describe("pageProps", () => {
  let generatedFunction: ReturnType<typeof pagePropsGenerator>;
  let returnValue: mockReturnValueType;
  const mockLocale = "en";
  const mockDefaultTranslations = ["authentication", "main", "navbar"];
  const mockTranslations = ["one", "two"];
  const mockPageKey = "test";

  beforeEach(() => jest.clearAllMocks());

  describe("when given a page and list of translations,", () => {
    beforeEach(() => {
      generatedFunction = pagePropsGenerator({
        pageKey: mockPageKey,
        translations: mockTranslations,
      });
    });

    it("should return a function", () => {
      expect(generatedFunction).toBeInstanceOf(Function);
    });

    describe("the returned function, when called with a locale", () => {
      beforeEach(async () => {
        returnValue = (await generatedFunction({
          locale: mockLocale,
        })) as never as mockReturnValueType;
      });

      it("should return page props that contain the input locale", () => {
        expect(returnValue.props.i18NextProps.locale).toBe(mockLocale);
      });

      it("should return page props that contain the correct translations", () => {
        expect(returnValue.props.i18NextProps.translations).toStrictEqual(
          mockDefaultTranslations.concat(mockTranslations)
        );
      });

      it("should return page props that contain the correct headerProps", () => {
        expect(returnValue.props.headerProps.pageKey).toBe(mockPageKey);
      });
    });
  });

  describe("when given a page and no list of translations,", () => {
    beforeEach(() => {
      generatedFunction = pagePropsGenerator({
        pageKey: mockPageKey,
      });
    });

    it("should return a function", () => {
      expect(generatedFunction).toBeInstanceOf(Function);
    });

    describe("the returned function", () => {
      beforeEach(async () => {
        returnValue = (await generatedFunction({
          locale: mockLocale,
        })) as never as mockReturnValueType;
      });

      it("should return page props that contain the correct translations", () => {
        expect(returnValue.props.i18NextProps.translations).toStrictEqual(
          mockDefaultTranslations
        );
      });
    });
  });
});
