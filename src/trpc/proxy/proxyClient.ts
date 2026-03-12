import { AuthProxyClient } from "./clients/authProxyClient";
import { EventsProxyClient } from "./clients/eventsProxyClient";
import { ProxyHttpClient } from "./clients/proxyHTTPClient";
import { AuthenticationProxyClient } from "./clients/authenticationProxyClient";

export class ProxyClient {
  public readonly events: EventsProxyClient;
  public readonly rbac: AuthProxyClient;
  public readonly http: ProxyHttpClient;
  public readonly auth: AuthenticationProxyClient;
  constructor(
    private readonly baseUrl: string,
    private readonly req: Request,
    private readonly res: Response,
  ) {
    this.http = new ProxyHttpClient(this.baseUrl, this.req, this.res);
    this.auth = new AuthenticationProxyClient(this.http, this.req, this.res);
    this.events = new EventsProxyClient(this.http);
    this.rbac = new AuthProxyClient(this.http);
  }
}
