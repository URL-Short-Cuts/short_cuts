import EndPointBase from "../../../../backend/api/bases/endpoint.url.base.class";
import S3Integration from "../../../../backend/integrations/integration.s3.class";
import apiRoutes from "../../../../config/apiRoutes";

class UrlEndpointFactory extends EndPointBase {
  route = apiRoutes.v1.urls + "/:id";
  methods = ["GET" as const];

  async getIntegration(hash: string): Promise<Record<string, string>> {
    const s3 = new S3Integration();
    return s3.readUrl(hash);
  }
}

export const endpointFactory = new UrlEndpointFactory();
export default endpointFactory.create();
