export class TRPCResolverError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "Error within tRPC mutation resolver";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, TRPCResolverError.prototype);
  }
}
