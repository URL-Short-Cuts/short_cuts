import nextConnect from "next-connect";
import { knownStatuses } from "../../../config/api";
import * as status from "../../../config/status";
import Logger from "../endpoint.logger";
import type { APIRequest } from "../../../types/api/request.d";
import type { HttpMethodType } from "../../../types/general/http";
import type IntegrationError from "../../integrations/integration.error.class";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextConnect } from "next-connect";

export default abstract class UrlEndpointFactoryBase {
  route!: string;
  methods!: HttpMethodType[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getIntegration(_: string): Promise<Record<string, string>> {
    return Promise.resolve({ error: "Not Implemented." });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async postIntegration(_: string): Promise<Record<string, string>> {
    return Promise.resolve({ error: "Not Implemented." });
  }

  abstract attachGetHandler(
    baseHandler: NextConnect<APIRequest, NextApiResponse>
  ): void;

  abstract attachPostHandler(
    baseHandler: NextConnect<APIRequest, NextApiResponse>
  ): void;

  create() {
    const handler = nextConnect<APIRequest, NextApiResponse>({
      onError: this.onError,
      onNoMatch: this.onNoMatch,
    });
    if (this.methods.includes("GET")) this.attachGetHandler(handler);
    if (this.methods.includes("POST")) this.attachPostHandler(handler);
    handler.use(Logger);
    return handler;
  }

  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json(status.STATUS_405_MESSAGE);
  }

  onError(
    err: IntegrationError,
    req: APIRequest,
    res: NextApiResponse,
    next: () => void
  ) {
    req.error = err.toString();
    if (err.statusCode && knownStatuses[err.statusCode]) {
      res.status(err.statusCode).json(knownStatuses[err.statusCode]);
    } else {
      res.status(502).json(status.STATUS_502_MESSAGE);
    }
    next();
  }
}
