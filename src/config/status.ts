import type { StatusMessageType } from "../types/api/status.d";

export const STATUS_200_MESSAGE: StatusMessageType = {
  detail: "OK",
};
export const STATUS_400_MESSAGE: StatusMessageType = {
  detail: "Invalid Request.",
};
export const STATUS_404_MESSAGE: StatusMessageType = {
  detail: "Not found.",
};
export const STATUS_429_MESSAGE: StatusMessageType = {
  detail: "Rate Limit exceeded.",
};
export const STATUS_405_MESSAGE: StatusMessageType = {
  detail: "Incorrect http method.",
};
export const STATUS_502_MESSAGE: StatusMessageType = {
  detail: "An error occurred processing this request.",
};
