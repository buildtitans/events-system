"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedEvents = seedEvents;
const db_1 = require("@/src/server/core/db/db");
const placeholder_events_json_1 = __importDefault(require("@/src/server/core/db/seeds/data/placeholder-events.json"));
async function seedEvents(groupsBySlug) {
    if (process.env.NODE_ENV === "production") {
        throw new Error("Seeding disabled in production");
    }
    for (const event of placeholder_events_json_1.default) {
        const groupID = groupsBySlug[event.group];
        console.log(groupID);
        const row = {
            title: event.title,
            description: event.description,
            tag: event.tag,
            img: event.img ?? null,
            group_id: groupID,
            starts_at: event.starts_at,
            meeting_location: event.meeting_location,
            status: event.status,
        };
        const inserted = await db_1.db
            .insertInto("events")
            .values(row)
            .onConflict((c) => c.columns(["group_id", "starts_at"]).doUpdateSet({
            title: row.title,
            description: row.description,
            tag: row.tag,
            img: row.img,
        }))
            .returning("id")
            .execute();
        if (inserted.length === 0) {
            throw new Error(`Event insert failed: ${event.title}`);
        }
    }
    console.log(`Seeded ${placeholder_events_json_1.default.length} events from placeholder-events.json`);
}
//# sourceMappingURL=seedEvents.js.map