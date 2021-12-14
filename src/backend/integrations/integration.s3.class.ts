import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import IntegrationError from "./integration.error.class";
import type { Readable } from "stream";

export default class S3Integration {
  bucketName: string;
  client: S3Client;
  fourOhFourResponse = "AccessDenied";

  constructor() {
    this.bucketName = process.env.SHORT_CUTS_URL_BUCKET;
    this.client = new S3Client({
      region: process.env.SHORT_CUTS_AWS_REGION,
      credentials: {
        accessKeyId: process.env.SHORT_CUTS_AWS_ACCESS_KEY,
        secretAccessKey: process.env.SHORT_CUTS_AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async streamToString(stream: Readable): Promise<string> {
    return await new Promise((resolve) => {
      const chunks: Uint8Array[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", () => {
        throw new IntegrationError("Read error.");
      });
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
  }

  async readUrl(hash: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: hash,
    });
    try {
      const response = await this.client.send(command);
      return JSON.parse(await this.streamToString(response.Body as Readable));
    } catch (err) {
      if ((err as Error).name == this.fourOhFourResponse)
        throw new IntegrationError("Not found.", 404);
      throw err;
    }
  }

  async writeUrl(hash: string, url: string) {
    const command = new PutObjectCommand({
      Body: JSON.stringify({ url }),
      Bucket: this.bucketName,
      Key: hash,
      ContentType: "application/json",
    });
    await this.client.send(command);
  }
}
