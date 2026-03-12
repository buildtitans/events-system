import { ProxyClient } from "../proxy/proxyClient";
import { serverBaseUrl } from "@/src/lib/utils/init/requireEnv";
import { RoleAuthenticator } from "../proxy/auth/roleAuthenticator";
import { SessionProxyHandler } from "../proxy/auth/setSessionCookie";

export type trpcClientContext = {
  api: ProxyClient;
  user: { id: string | number; email: string } | undefined;
  res: Response;
  req: Request;
  auth: RoleAuthenticator;
  session: SessionProxyHandler;
};

type CreateContextParams = {
  req: Request;
  res: Response;
};

const url = serverBaseUrl.FASTIFY_SERVER_URL;

export async function createContext({
  req,
  res,
}: CreateContextParams): Promise<trpcClientContext> {
  const user_id = undefined;
  const api = new ProxyClient(url, req, res);
  const auth = new RoleAuthenticator(user_id, api);
  const session = new SessionProxyHandler(res);

  return {
    api,
    user: undefined,
    res,
    req,
    auth,
    session,
  };
}
