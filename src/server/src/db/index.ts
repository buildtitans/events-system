import { DBClient } from "./clients/dbClient";
import { db } from "./db";
import type { Events } from "@/src/server/src/db/types/db";
import type { DB } from "@/src/server/src/db/types/db";

export { DBClient, db }

export type { Events, DB }