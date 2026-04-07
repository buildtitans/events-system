"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsClient = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const validateSchema_1 = require("@/src/shared/utils/validation/validateSchema");
dayjs_1.default.extend(utc_1.default);
class EventsClient {
    db;
    constructor(db) {
        this.db = db;
        this.db = db;
    }
    async getEvents() {
        const raw = await this.getRawEvents();
        console.log({
            EventSchema: this.formatRawEvents(raw),
        });
        return this.formatRawEvents(raw);
    }
    async getFlattenedEvents() {
        const raw = await this.db.selectFrom("events").selectAll().execute();
        return this.formatRawEvents(raw);
    }
    async searchEventByTitle(query) {
        const raw = await this.db
            .selectFrom("events")
            .selectAll()
            .where("title", "ilike", `%${query}%`)
            .execute();
        return this.formatRawEvents(raw);
    }
    async getGroupEvents(group_id) {
        const raw = await this.getRawEventsFromGroup(group_id);
        if (!Array.isArray(raw) || raw.length === 0)
            return [];
        return this.formatRawEvents(raw);
    }
    async getGroupEventsByGroupId(group_id) {
        const raw = await this.db
            .selectFrom("events")
            .selectAll()
            .where("group_id", "=", group_id)
            .execute();
        return this.formatRawEvents(raw);
    }
    async getEventsByGroupIds(groupIds) {
        if (groupIds.length === 0)
            return [];
        const raw = await this.db
            .selectFrom("events")
            .selectAll()
            .where("group_id", "in", groupIds)
            .where("status", "=", "scheduled")
            .execute();
        return this.formatRawEvents(raw);
    }
    async getFlattenedEventsByIds(ids) {
        const raw = await this.getRawEventsByIds(ids);
        return this.formatRawEvents(raw);
    }
    async getEvent(event_id) {
        const raw = await this.db
            .selectFrom("events")
            .selectAll()
            .where("id", "=", event_id)
            .limit(1)
            .executeTakeFirstOrThrow();
        return this.formatEvent(raw);
    }
    async getEventsByIds(ids) {
        const raw = await this.getRawEventsByIds(ids);
        return this.formatRawEvents(raw);
    }
    async updateEventStatus(eventUpdate) {
        const update = await this.db
            .updateTable("events")
            .set({
            status: eventUpdate.status,
        })
            .where("id", "=", eventUpdate.event_id)
            .executeTakeFirstOrThrow();
        return { updateStatus: update ? "success" : "failure" };
    }
    async createNewEvent(newEvent) {
        const insertable = this.toInsertableEvent(newEvent);
        const inserted = await this.insertNewEvent(insertable);
        const event = this.formatEvent(inserted);
        return event;
    }
    async getRawEvents() {
        return this.db
            .selectFrom("events")
            .selectAll()
            .where("status", "=", "scheduled")
            .orderBy("created_at", "desc")
            .execute();
    }
    async getRawEventsByIds(ids) {
        return await this.db
            .selectFrom("events")
            .selectAll()
            .where("id", "in", ids)
            .where("status", "=", "scheduled")
            .execute();
    }
    async getRawEventsFromGroup(group_id) {
        const raw = await this.db
            .selectFrom("events")
            .selectAll()
            .where("group_id", "=", group_id)
            .orderBy("created_at")
            .execute();
        return raw;
    }
    toInsertableEvent(newEvent) {
        const start_time = (0, dayjs_1.default)(newEvent.starts_at)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss.sssZ");
        return {
            title: newEvent.title,
            description: newEvent.description,
            img: "https://picsum.photos/800/450?random=2",
            group_id: newEvent.group_id,
            starts_at: start_time,
            created_at: new Date(),
            tag: "placeholder tag",
            meeting_location: newEvent.meeting_location,
            status: "scheduled",
        };
    }
    async insertNewEvent(newEvent) {
        return await this.db
            .insertInto("events")
            .values(newEvent)
            .returningAll()
            .executeTakeFirstOrThrow();
    }
    formatRawEvents(rows) {
        return rows.map((row) => {
            const startsAtMs = row.starts_at.getTime();
            return (0, validateSchema_1.eventValidator)({
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
        });
    }
    formatEvent(raw) {
        const startsAtMs = raw.starts_at.getTime();
        return (0, validateSchema_1.eventValidator)({
            id: raw.id,
            tag: raw.tag,
            title: raw.title,
            description: raw.description,
            updated_at: raw.updated_at.toISOString(),
            created_at: raw.created_at.toISOString(),
            group_id: raw.group_id,
            starts_at: raw.starts_at.toISOString(),
            starts_at_ms: startsAtMs,
            img: raw.img,
            meeting_location: raw.meeting_location,
            status: raw.status,
        });
    }
}
exports.EventsClient = EventsClient;
//# sourceMappingURL=EventsClient.js.map