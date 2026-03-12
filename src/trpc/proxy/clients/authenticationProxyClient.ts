import {
  DbUserSchemaType,
  PublicUserSchemaType,
} from "@/src/schemas/auth/userSchema";
import { ProxyHttpClient } from "./proxyHTTPClient";

export class AuthenticationProxyClient {
  constructor(
    private readonly http: ProxyHttpClient,
    private req: Request,
    private res: Response,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{
    user: DbUserSchemaType;
    sessionToken?: string;
    setCookieHeader?: string;
  }> {
    return await this.http.post("/auth/login", { email, password });
  }
}
