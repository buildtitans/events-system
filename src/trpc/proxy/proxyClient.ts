import { AuthProxyClient } from "./clients/authProxyClient";
import { EventsProxyClient } from "./clients/events";
import { ProxyHttpClient } from "./clients/proxyHTTPClient";

export class ProxyClient {
  public readonly events: EventsProxyClient;
  public readonly auth: AuthProxyClient;
  public readonly http: ProxyHttpClient;
  constructor(
    private readonly baseUrl: string,
    private readonly req: Request,
  ) {
    this.http = new ProxyHttpClient(this.baseUrl, this.req);
    this.events = new EventsProxyClient(this.http);
    this.auth = new AuthProxyClient(this.http);
  }
}
