import { db } from "@/src/server/core/db/db";
import type { Insertable } from "kysely";
import type { Events } from "@/src/server/core/db/types/db";
import rawEvents from "@/src/server/core/db/seeds/data/placeholder-events.json";

export async function seedEvents(groupsBySlug: Record<string, string>) {
  for (const event of rawEvents) {
    const groupID = groupsBySlug[event.group];
    console.log(groupID);

    const row: Insertable<Events> = {
      title: event.title,
      description: event.description,
      tag: event.tag,
      img: event.img ?? null,
      group_id: groupID,
      starts_at: event.starts_at,
      meeting_location: event.meeting_location,
      status: event.status,
    };
    const inserted = await db
      .insertInto("events")
      .values(row)
      .onConflict((c) =>
        c.columns(["group_id", "starts_at"]).doUpdateSet({
          title: row.title,
          description: row.description,
          tag: row.tag,
          img: row.img,
        }),
      )

      .returning("id")
      .execute();

    if (inserted.length === 0) {
      throw new Error(`Event insert failed: ${event.title}`);
    }
  }

  console.log(`Seeded ${rawEvents.length} events from placeholder-events.json`);
}
