import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { PassThrough } from "stream";
import IntegrationError from "../integration.error.class";
import S3Integration from "../integration.s3.class";

jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn(() => MockS3Client),
    GetObjectCommand: jest.fn(() => MockGetCommand),
    PutObjectCommand: jest.fn(() => MockPutCommand),
  };
});

const MockS3Client = {
  send: jest.fn(async () => null),
};

const MockGetCommand = { MockCommand: "MockCommand" };
const MockPutCommand = { MockCommand: "MockCommand" };

describe("S3Integration", () => {
  let integration: S3Integration;
  let originalEnvironment: typeof process.env;
  const mockUrl = "https://yahoo.ca";
  const mockHash = "aaa";

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  afterAll(() => jest.restoreAllMocks());

  beforeEach(() => {
    jest.clearAllMocks();
    setupEnv();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const setupEnv = () => {
    process.env.SHORT_CUTS_AWS_REGION = "MockValue1";
    process.env.SHORT_CUTS_AWS_ACCESS_KEY = "MockValue2";
    process.env.SHORT_CUTS_AWS_REGION = "MockValue3";
    process.env.SHORT_CUTS_URL_BUCKET = "MockValue4";
  };

  const arrange = () => {
    integration = new S3Integration();
  };

  describe("when initialized", () => {
    beforeEach(() => arrange());

    it("should contain the expected properties", () => {
      expect(integration.client).toBe(MockS3Client);
      expect(integration.bucketName).toBe(process.env.SHORT_CUTS_URL_BUCKET);
      expect(integration.fourOhFourResponse).toBe("AccessDenied");
    });

    it("should initialize the S3 client correctly", () => {
      expect(S3Client).toBeCalledWith({
        region: process.env.SHORT_CUTS_AWS_REGION,
        credentials: {
          accessKeyId: process.env.SHORT_CUTS_AWS_ACCESS_KEY,
          secretAccessKey: process.env.SHORT_CUTS_AWS_SECRET_ACCESS_KEY,
        },
      });
    });
  });

  describe("writeUrl", () => {
    beforeEach(async () => {
      arrange();
      await integration.writeUrl(mockHash, mockUrl);
    });

    it("should send the command to the S3 bucket as expected", () => {
      const expectedCommand = {
        Body: JSON.stringify({ url: mockUrl }),
        Bucket: integration.bucketName,
        Key: mockHash,
        ContentType: "application/json",
      };
      expect(PutObjectCommand).toBeCalledTimes(1);
      expect(PutObjectCommand).toBeCalledWith(expectedCommand);
      expect(integration.client.send).toBeCalledTimes(1);
      expect(integration.client.send).toBeCalledWith(MockPutCommand);
    });
  });

  describe("readUrl", () => {
    let returnValue: Record<string, string>;

    describe("when an object is found", () => {
      beforeEach(async () => {
        arrange();
        const mockStream = new PassThrough();
        mockStream.write(JSON.stringify({ url: mockUrl }));
        mockStream.end();
        (integration.client.send as jest.Mock).mockReturnValue({
          Body: mockStream,
        });
        returnValue = await integration.readUrl(mockHash);
      });

      it("should send the command to the S3 bucket as expected", () => {
        const expectedCommand = {
          Bucket: integration.bucketName,
          Key: mockHash,
        };
        expect(GetObjectCommand).toBeCalledTimes(1);
        expect(GetObjectCommand).toBeCalledWith(expectedCommand);
        expect(integration.client.send).toBeCalledTimes(1);
        expect(integration.client.send).toBeCalledWith(MockPutCommand);
      });

      it("should return the expected value", () => {
        expect(returnValue).toStrictEqual({ url: mockUrl });
      });
    });

    describe("when an object is NOT found", () => {
      beforeEach(async () => {
        arrange();
        const mockError = new Error("AccessDenied");
        mockError.name = integration.fourOhFourResponse;
        (integration.client.send as jest.Mock).mockImplementation(() => {
          throw mockError;
        });
      });

      it("should send the command to the S3 bucket as expected", async () => {
        try {
          returnValue = await integration.readUrl(mockHash);
          const expectedCommand = {
            Bucket: integration.bucketName,
            Key: mockHash,
          };
          expect(GetObjectCommand).toBeCalledTimes(1);
          expect(GetObjectCommand).toBeCalledWith(expectedCommand);
          expect(integration.client.send).toBeCalledTimes(1);
          expect(integration.client.send).toBeCalledWith(MockPutCommand);
        } catch {}
      });

      it("should throw an IntegrationError", async () => {
        try {
          returnValue = await integration.readUrl(mockHash);
          expect(returnValue).toStrictEqual({ url: mockUrl });
        } catch (err) {
          expect(err).toBeInstanceOf(IntegrationError);
          expect((err as IntegrationError).statusCode).toBe(404);
        }
      });
    });

    describe("when an unknown error occurs", () => {
      beforeEach(async () => {
        arrange();
        const mockError = new Error("SomeUnknownError");
        (integration.client.send as jest.Mock).mockImplementation(() => {
          throw mockError;
        });
      });

      it("should send the command to the S3 bucket as expected", async () => {
        try {
          returnValue = await integration.readUrl(mockHash);
          const expectedCommand = {
            Bucket: integration.bucketName,
            Key: mockHash,
          };
          expect(GetObjectCommand).toBeCalledTimes(1);
          expect(GetObjectCommand).toBeCalledWith(expectedCommand);
          expect(integration.client.send).toBeCalledTimes(1);
          expect(integration.client.send).toBeCalledWith(MockPutCommand);
        } catch {}
      });

      it("should rethrow the error", async () => {
        try {
          returnValue = await integration.readUrl(mockHash);
          expect(returnValue).toStrictEqual({ url: mockUrl });
        } catch (err) {
          expect(err).not.toBeInstanceOf(IntegrationError);
        }
      });
    });
  });

  describe("streamToString", () => {
    let returnValue: Record<string, string>;

    describe("when a stream error occurs", () => {
      let mockStream: PassThrough;

      beforeEach(async () => {
        arrange();
        mockStream = new PassThrough();
        (integration.client.send as jest.Mock).mockReturnValue({
          Body: mockStream,
        });
        integration.streamToString(mockStream);
      });

      it("should not throw an IntegrationError", () => {
        try {
          mockStream.emit("error", "SimulatedReadError");
          expect(returnValue).toStrictEqual({ url: mockUrl });
        } catch (err) {
          expect(err).toBeInstanceOf(IntegrationError);
        }
      });
    });
  });
});
