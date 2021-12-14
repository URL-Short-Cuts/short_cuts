import type { APIRequest } from "../../types/api/request.d";
import type { NextApiResponse } from "next";

const logger = (req: APIRequest, res: NextApiResponse, next: () => void) => {
  const remoteIp = getRemoteIpAddress(req);

  let message = `${remoteIp} `;
  message += `${req.method} `;
  message += `${req.url} `;
  message += `${res.statusCode} `;
  message += `${req.headers["content-length"]} `;
  message += `${req.headers["referer"]} `;
  message += `${req.headers["user-agent"]}`;
  if (req.error) message += ` (${req.error})`;

  console.log(message);

  next();
};

const getRemoteIpAddress = (req: APIRequest) => {
  if (req.socket?.remoteAddress) return req.socket.remoteAddress;

  const fromForwardedHeader = req.headers["x-forwarded-for"];
  if (typeof fromForwardedHeader === "string")
    return fromForwardedHeader.split(",")[0];
  if (Array.isArray(fromForwardedHeader)) return fromForwardedHeader[0];
  return fromForwardedHeader;
};

export default logger;
