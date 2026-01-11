import type { Selectable } from "kysely";
import type { Events } from "@/src/server/db";
import type { EventSchemaType } from "@/src/schemas/eventSchema";
import { AuthorsValidator } from "@/src/server/validation/validateSchema";

function formatRawEvents(rows: Selectable<Events>[]): EventSchemaType[] {
    return rows.map(row => {
        if (!AuthorsValidator.Check(row.authors)) {
            throw new Error("Invalid authors JSON");
        }

        return {
            id: String(row.id),
            img: row.img,
            tag: row.tag,
            title: row.title,
            description: row.description,
            authors: row.authors,
            created_at: String(row.created_at),
            updated_at: String(row.updated_at),
        };
    });
}

export { formatRawEvents };