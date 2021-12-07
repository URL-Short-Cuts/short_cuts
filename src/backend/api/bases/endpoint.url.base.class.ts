import { body, validationResult } from "express-validator";
import nextConnect from "next-connect";
import { knownStatuses } from "../../../config/api";
import * as status from "../../../config/status";
import { IntegrationError } from "../../integrations/integration.error.class";
import Logger from "../endpoint.logger";
import type { APIRequest } from "../../../types/api/request.d";
import type { NextApiRequest, NextApiResponse } from "next";

export default abstract class LastFMApiEndpointFactory {
  route!: string;

  abstract externalIntegration(url: string): Record<string, string>;

  create() {
    const handler = nextConnect<APIRequest, NextApiResponse>({
      onError: this.onError,
      onNoMatch: this.onNoMatch,
    });
    handler.post(
      this.route,
      body("url").isString(),
      body("url").isLength({ min: 6 }),
      async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw new IntegrationError("Invalid url specified.", 400);
        } else {
          try {
            const url = new URL(req.body.url);
            if (!url.hostname.split(".")[1])
              throw new Error("Invalid url, hostname without suffix.");
          } catch (_) {
            throw new IntegrationError("Invalid url specified.", 400);
          }
          const integrationResponse = await this.externalIntegration(
            req.body.url
          );
          res.status(200).json(integrationResponse);
        }
        next();
      }
    );
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
