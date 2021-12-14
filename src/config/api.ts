import * as status from "../config/status";
import type { StatusMessageType } from "../types/api/status.d";

export const knownStatuses: { [index: number]: StatusMessageType } = {
  400: status.STATUS_400_MESSAGE,
  404: status.STATUS_404_MESSAGE,
  429: status.STATUS_429_MESSAGE,
};
