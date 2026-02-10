import type { Selectable } from "kysely";
import type { Events } from "@/src/server/db";
import type { EventSchemaType } from "@/src/schemas/eventSchema";
import { AuthorsValidator, eventValidator } from "@/src/lib/utils/validation/validateSchema";

function formatRawEvents(rows: Selectable<Events>[]): EventSchemaType[] {
    return rows.map(row => {
        if (!AuthorsValidator.Check(row.authors)) {
            throw new Error("Invalid authors JSON");
        }

        const parsed_authors = typeof row.authors === "string" ? JSON.parse(row.authors) : row.authors



        const parsed = eventValidator({
            id: String(row.id),
            img: row.img,
            tag: row.tag,
            title: row.title,
            description: row.description,
            starts_at: row.starts_at.toISOString(),
            meeting_location: row.meeting_location,
            group_id: row.group_id,
            authors: parsed_authors,
            created_at: row.created_at.toISOString(),
            updated_at: row.updated_at ? row.updated_at.toISOString() : null,
            status: row.status
        });

        return parsed;
    });
}

export { formatRawEvents };