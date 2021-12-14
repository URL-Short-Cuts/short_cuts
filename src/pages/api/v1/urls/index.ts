import EndPointBase from "../../../../backend/api/bases/endpoint.url.base.class";
import DynamoDBIntegration from "../../../../backend/integrations/integration.dynamodb.class";
import S3Integration from "../../../../backend/integrations/integration.s3.class";
import apiRoutes from "../../../../config/apiRoutes";

class UrlEndpointFactory extends EndPointBase {
  route = apiRoutes.v1.urls;
  methods = ["POST" as const];

  async postIntegration(url: string): Promise<Record<string, string>> {
    const db = new DynamoDBIntegration();
    const s3 = new S3Integration();
    const hash = await db.getNextFreeHash();
    await s3.writeUrl(hash, url);
    return { url: new URL(process.env.HOSTNAME + "/" + hash).href };
  }
}

export const endpointFactory = new UrlEndpointFactory();
export default endpointFactory.create();
