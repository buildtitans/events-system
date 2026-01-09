import { DBClient } from "./clients/dbClient";
import { db } from "./db";
import type { Events } from "@/src/server/db/types/db";
import type { DB } from "@/src/server/db/types/db";

export { DBClient, db }

export type { Events, DB }