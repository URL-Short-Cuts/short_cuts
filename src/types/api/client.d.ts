export type Await<T> = T extends PromiseLike<infer U> ? U : T;

export type FetchResponse = Await<ReturnType<typeof fetch>>;

export type HttpMethodType = "GET" | "POST";

export type StatusMessageType = {
  detail: string;
};

export type ApiResponse<RESPONSE> = {
  headers: Record<string, string>;
  status: number;
  response: RESPONSE | StatusMessageType;
};
