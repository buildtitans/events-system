import { Kysely } from "kysely";
import { db } from "../db";
import { DB } from "../db/types";

async function listEvents(db: Kysely<DB>): Promise<any> {

    const rows = await db
        .selectFrom("events")
        .selectAll()
        .orderBy("created_at", "desc")
        .execute();

    return rows;
}

export { listEvents };