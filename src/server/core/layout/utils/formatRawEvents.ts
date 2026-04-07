import type { Selectable } from "kysely";
import type { Events } from "@/src/server/core/db";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { eventValidator } from "@/src/shared/utils/validation/validateSchema";

function formatRawEvents(rows: Selectable<Events>[]): EventSchemaType[] {
  return rows.map((row) => {
    const startsAtMs = row.starts_at.getTime();

    const parsed = eventValidator({
      id: String(row.id),
      img: row.img,
      tag: row.tag,
      title: row.title,
      description: row.description,
      starts_at_ms: startsAtMs,
      starts_at: row.starts_at.toISOString(),
      meeting_location: row.meeting_location,
      group_id: row.group_id,
      created_at: row.created_at.toISOString(),
      updated_at: row.updated_at ? row.updated_at.toISOString() : null,
      status: row.status,
    });

    return parsed;
  });
}

export { formatRawEvents };
