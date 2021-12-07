export class IntegrationError extends Error {
  statusCode: number | undefined;

  constructor(message: string, statusCode?: number) {
    super(message);
    if (statusCode) this.statusCode = statusCode;
  }
}
