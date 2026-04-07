"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRawEvents = formatRawEvents;
const validateSchema_1 = require("@/src/shared/utils/validation/validateSchema");
function formatRawEvents(rows) {
    return rows.map((row) => {
        const startsAtMs = row.starts_at.getTime();
        const parsed = (0, validateSchema_1.eventValidator)({
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
//# sourceMappingURL=formatRawEvents.js.map