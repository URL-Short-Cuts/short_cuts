import { createRouter } from "next-connect";
import { knownStatuses } from "../../../config/api";
import * as status from "../../../config/status";
import Logger from "../endpoint.logger";
import type { APIRequest } from "../../../types/api/request.d";
import type { HttpMethodType } from "../../../types/general/http";
import type IntegrationError from "../../integrations/integration.error.class";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NodeRouter } from "next-connect/dist/types/node";

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
    baseHandler: NodeRouter<APIRequest, NextApiResponse>
  ): void;

  abstract attachPostHandler(
    baseHandler: NodeRouter<APIRequest, NextApiResponse>
  ): void;

  create() {
    const router = createRouter<APIRequest, NextApiResponse>();
    if (this.methods.includes("GET")) this.attachGetHandler(router);
    if (this.methods.includes("POST")) this.attachPostHandler(router);
    router.use(Logger);
    router.use(() => null);
    return router.handler({
      onError: this.onError as (
        err: unknown,
        req: APIRequest,
        res: NextApiResponse
      ) => void,
      onNoMatch: this.onNoMatch,
    });
  }

  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json(status.STATUS_405_MESSAGE);
  }

  onError(err: IntegrationError, req: APIRequest, res: NextApiResponse) {
    req.error = err.toString();
    if (err.statusCode && knownStatuses[err.statusCode]) {
      res.status(err.statusCode).json(knownStatuses[err.statusCode]);
    } else {
      res.status(502).json(status.STATUS_502_MESSAGE);
    }
  }
}
