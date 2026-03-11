import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import { db, DBClient } from "../db";
import { ServiceClient } from "../services/serviceClient";
import type { AttendanceDictionaryType } from "../lib/utils/mapAttendanceDictionary";
import type { RBACType } from "../db/clients/types/types";
import { buildCache } from "../bootstrap/buildCache";

type CachedLookups = {
  roleLookupMap: RBACType;
  attendanceDictionary: AttendanceDictionaryType;
};

type ServerContextType = {
  services: ServiceClient;
  cache: CachedLookups;
  db: DBClient;
};

export async function buildContext(
  api: DBClient,
  user_id: DbUserSchemaType["id"] | null,
): Promise<ServerContextType> {
  return {
    services: new ServiceClient(api),
    cache: await buildCache(api, user_id),
    db: new DBClient(db),
  };
}
