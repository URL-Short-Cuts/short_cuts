import { body, validationResult } from "express-validator";
import EndpointFactoryBase from "./endpoint.base.class";
import { STATUS_404_MESSAGE } from "../../../config/status";
import { isValidUrl } from "../../../validators/urls";
import IntegrationError from "../../integrations/integration.error.class";
import type { APIRequest } from "../../../types/api/request.d";
import type { HttpMethodType } from "../../../types/general/http";
import type { NextApiResponse } from "next";
import type { NextConnect } from "next-connect";

export default abstract class UrlEndpointFactoryBase extends EndpointFactoryBase {
  route!: string;
  methods!: HttpMethodType[];

  attachPostHandler(baseHandler: NextConnect<APIRequest, NextApiResponse>) {
    baseHandler.post(
      this.route,
      body("url").isString(),
      body("url").isLength({ min: 6 }),
      async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty() || !isValidUrl(req.body.url)) {
          throw new IntegrationError("Invalid url specified.", 400);
        } else {
          const integrationResponse = await this.postIntegration(req.body.url);
          res.status(201).json(integrationResponse);
        }
        next();
      }
    );
  }

  attachGetHandler(baseHandler: NextConnect<APIRequest, NextApiResponse>) {
    baseHandler.get(this.route, async (req, res, next) => {
      try {
        const integrationResponse = await this.getIntegration(
          String(req.query.id)
        );
        res.status(200).json(integrationResponse);
      } catch (err) {
        res.status(404).json(STATUS_404_MESSAGE);
      }
      next();
    });
  }
}
