import { ProxyClient } from "../proxy/proxyClient";
import { serverBaseUrl } from "@/src/lib/utils/init/requireEnv";
import { RoleAuthenticator } from "../proxy/auth/roleAuthenticator";

export type trpcClientContext = {
  api: ProxyClient;
  user: { id: string | number; email: string } | undefined;
  res: Response;
  req: Request;
  auth: RoleAuthenticator;
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
  const api = new ProxyClient(url, req);
  const auth = new RoleAuthenticator(user_id, api);

  return {
    api,
    user: undefined,
    res,
    req,
    auth,
  };
}
