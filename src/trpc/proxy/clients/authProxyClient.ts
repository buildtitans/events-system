import { GroupMembersArraySchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { ProxyHttpClient } from "./proxyHTTPClient";

export class AuthProxyClient {
  constructor(private readonly http: ProxyHttpClient) {
    this.http = http;
  }

  async getMemberships(
    user_id: string | undefined,
  ): Promise<GroupMembersArraySchemaType> {
    return [];
  }
}
