import type { UrlHookType } from "../../types/api/hooks";

const mockUrlHook: UrlHookType = {
  created: null,
  createUrl: jest.fn(),
  status: null,
  resetCreateUrl: jest.fn(),
};

export default mockUrlHook;
