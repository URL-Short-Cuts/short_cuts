import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import ShortCutHashGenerator from "../../../generators/shortcut";
import DynamoDBIntegration from "../integration.dynamodb.class";

jest.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: jest.fn(),
  PutItemCommand: jest.fn(),
  UpdateItemCommand: jest.fn(),
  GetItemCommand: jest.fn(),
}));

describe("DynamoDBIntegration", () => {
  let integration: DynamoDBIntegration;
  let originalEnvironment: typeof process.env;
  let generatedHash: string;

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  beforeEach(() => {
    jest.resetAllMocks();
    setupEnv();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    process.env = originalEnvironment;
  });

  const setupEnv = () => {
    process.env.SHORT_CUTS_AWS_REGION = "MockValue1";
    process.env.SHORT_CUTS_AWS_ACCESS_KEY = "MockValue2";
    process.env.SHORT_CUTS_AWS_REGION = "MockValue3";
    process.env.SHORT_CUTS_DYNAMO_DB_TABLE = "MockValue4";
  };

  describe("when initialized", () => {
    beforeEach(() => (integration = new DynamoDBIntegration()));

    it("should contain the expected properties", () => {
      expect(integration.hashGenerator).toBeInstanceOf(ShortCutHashGenerator);
      expect(integration.client).toBeInstanceOf(DynamoDBClient);
      expect(integration.table).toBe(process.env.SHORT_CUTS_DYNAMO_DB_TABLE);
      expect(integration.conditionalCheckErrorName).toBe(
        "ConditionalCheckFailedException"
      );
    });

    it("should initialize the DynamoDB client correctly", () => {
      expect(DynamoDBClient).toBeCalledWith({
        apiVersion: "2012-08-10",
        region: process.env.SHORT_CUTS_AWS_REGION,
        credentials: {
          accessKeyId: process.env.SHORT_CUTS_AWS_ACCESS_KEY,
          secretAccessKey: process.env.SHORT_CUTS_AWS_SECRET_ACCESS_KEY,
        },
      });
    });
  });

  describe("getNextFreeHash", () => {
    let mockError: Error;
    const mockHash = "mockHash";

    beforeEach(() => {
      integration = new DynamoDBIntegration();
      integration.hashGenerator.next = jest.fn(() => mockHash);
    });

    describe("when an error occurs", () => {
      beforeEach(() => {
        mockError = new Error("TestError");
        (integration.client.send as jest.Mock) = jest.fn(() => ({
          Item: { hash: { S: "mockValue" } },
        }));
        integration.backOff = 1;
      });

      describe("when the error is a ConditionalCheckFailedException", () => {
        beforeEach(() => {
          mockError.name = integration.conditionalCheckErrorName;
          (UpdateItemCommand as jest.Mock).mockImplementation(() => {
            throw mockError;
          });
        });

        it("should throw the expected error", async () => {
          try {
            await integration.getNextFreeHash();
          } catch (err) {
            expect(err).toBe(mockError);
          }
        });

        it("should have retried the query", async () => {
          try {
            await integration.getNextFreeHash();
          } catch {}
          expect(UpdateItemCommand).toBeCalledTimes(1 + integration.retries);
        });
      });

      describe("when the error is NOT a ConditionalCheckFailedException", () => {
        beforeEach(() => {
          mockError.name = "unknownError";
          (UpdateItemCommand as jest.Mock).mockImplementation(() => {
            throw mockError;
          });
        });

        it("should throw the expected error", async () => {
          try {
            await integration.getNextFreeHash();
            expect(true).toBe(false);
          } catch (err) {
            expect(err).toBe(mockError);
          }
        });

        it("should have retried the query", async () => {
          try {
            await integration.getNextFreeHash();
          } catch {}
          expect(UpdateItemCommand).toBeCalledTimes(1);
        });
      });
    });

    describe("when the database is empty", () => {
      beforeEach(async () => {
        (integration.client.send as jest.Mock) = jest.fn(() => ({
          Item: undefined,
        }));
        generatedHash = await integration.getNextFreeHash();
      });

      it("should return the expected hash", () => {
        expect(generatedHash).toBe(mockHash);
      });

      it("should create the correct get command", () => {
        expect(GetItemCommand).toBeCalledWith({
          TableName: integration.table,
          Key: {
            key: { N: "0" },
          },
        });
      });

      it("should create the correct put command", () => {
        expect(PutItemCommand).toBeCalledWith({
          TableName: integration.table,
          Item: {
            key: { N: "0" },
            hash: { S: mockHash },
          },
          ReturnValues: "NONE",
        });
      });

      it("should send both commands to the database", () => {
        const calls = (integration.client.send as jest.Mock).mock.calls;
        expect(integration.client.send).toBeCalledWith({});
        expect(calls[0][0]).toBeInstanceOf(GetItemCommand);
        expect(calls[1][0]).toBeInstanceOf(PutItemCommand);
      });
    });

    describe("when the database contains an existing hash", () => {
      const mockOldHash = "mockOldHash";

      beforeEach(async () => {
        (integration.client.send as jest.Mock) = jest.fn(() => ({
          Item: { hash: { S: mockOldHash } },
        }));
        generatedHash = await integration.getNextFreeHash();
      });

      it("should return the expected hash", () => {
        expect(generatedHash).toBe(mockHash);
      });

      it("should create the correct get command", () => {
        expect(GetItemCommand).toBeCalledWith({
          TableName: integration.table,
          Key: {
            key: { N: "0" },
          },
        });
      });

      it("should create the correct put command", () => {
        expect(UpdateItemCommand).toBeCalledWith({
          TableName: integration.table,
          Key: {
            key: { N: "0" },
          },
          UpdateExpression: "SET #existingHash = :newHash",
          ConditionExpression: "#existingHash = :oldHash",
          ExpressionAttributeNames: {
            "#existingHash": "hash",
          },
          ExpressionAttributeValues: {
            ":newHash": { S: mockHash },
            ":oldHash": { S: mockOldHash },
          },
          ReturnValues: "UPDATED_NEW",
        });
      });

      it("should send both commands to the database", () => {
        const calls = (integration.client.send as jest.Mock).mock.calls;
        expect(integration.client.send).toBeCalledWith({});
        expect(calls[0][0]).toBeInstanceOf(GetItemCommand);
        expect(calls[1][0]).toBeInstanceOf(UpdateItemCommand);
      });
    });
  });
});
