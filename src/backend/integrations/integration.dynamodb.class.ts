import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import ShortCutHashGenerator from "../../generators/shortcut";

export default class DynamoDBIntegration {
  client: DynamoDBClient;
  hashGenerator: ShortCutHashGenerator;
  table: string;
  backOff = 500;
  retries = 10;
  conditionalCheckErrorName = "ConditionalCheckFailedException";

  constructor() {
    this.client = new DynamoDBClient({
      apiVersion: "2012-08-10",
      region: process.env.SHORT_CUTS_AWS_REGION,
      credentials: {
        accessKeyId: process.env.SHORT_CUTS_AWS_ACCESS_KEY,
        secretAccessKey: process.env.SHORT_CUTS_AWS_SECRET_ACCESS_KEY,
      },
    });
    this.hashGenerator = new ShortCutHashGenerator();
    this.table = process.env.SHORT_CUTS_DYNAMO_DB_TABLE;
  }

  async getNextFreeHash() {
    return await this.hashFromDB(this.retries);
  }

  private async hashFromDB(retries: number): Promise<string> {
    try {
      const response = await this.client.send(
        new GetItemCommand(this.getQueryParams())
      );
      const currentHash = response.Item?.hash;
      if (currentHash?.S) {
        return await this.incrementDBHash(currentHash.S);
      } else {
        return await this.initializeDBHash();
      }
    } catch (err) {
      if ((err as Error).name === this.conditionalCheckErrorName) {
        if (retries > 0) {
          return await this.retryWithBackOff(retries);
        }
      }
      throw err;
    }
  }

  private async incrementDBHash(currentHash: string) {
    this.hashGenerator.setCurrentHash(currentHash);
    const newHash = this.hashGenerator.next();

    await this.client.send(
      new UpdateItemCommand(this.updateQueryParams(newHash, currentHash))
    );
    return newHash;
  }

  private async initializeDBHash() {
    const newHash = this.hashGenerator.next();

    await this.client.send(new PutItemCommand(this.putQueryParams(newHash)));
    return newHash;
  }

  private async retryWithBackOff(retries: number) {
    await new Promise((resolve) => setTimeout(resolve, this.backOff));

    return this.hashFromDB(retries - 1);
  }

  private getQueryParams() {
    return {
      TableName: this.table,
      Key: {
        key: { N: "0" },
      },
    };
  }

  private putQueryParams(newHash: string) {
    return {
      TableName: this.table,
      Item: {
        key: { N: "0" },
        hash: { S: newHash },
      },
      ReturnValues: "NONE",
    };
  }

  private updateQueryParams(newHash: string, oldHash: string) {
    return {
      TableName: this.table,
      Key: {
        key: { N: "0" },
      },
      UpdateExpression: "SET #existingHash = :newHash",
      ConditionExpression: "#existingHash = :oldHash",
      ExpressionAttributeNames: {
        "#existingHash": "hash",
      },
      ExpressionAttributeValues: {
        ":newHash": { S: newHash },
        ":oldHash": { S: oldHash },
      },
      ReturnValues: "UPDATED_NEW",
    };
  }
}
