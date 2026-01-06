import { db } from "../db";

async function getEvents(): Promise<any> {

    const rows = await db
        .selectFrom("events")
        .selectAll()
        .orderBy("created_at", "desc")
        .execute();

    return rows;
}

export { getEvents };