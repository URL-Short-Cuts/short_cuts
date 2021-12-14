export type UrlCreateRequestType = { url: string };

export type UrlCreateResponseType = {
  status: null | number;
  url: null | string;
};

export type UrlHookType = {
  created: null | string;
  createUrl: (url: string) => void;
  status: null | number;
  resetCreateUrl: () => void;
};
