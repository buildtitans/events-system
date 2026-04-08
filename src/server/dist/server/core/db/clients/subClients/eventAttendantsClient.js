"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventAttendantsClient = void 0;
const schemaValidators_1 = require("../../../lib/validation/schemaValidators");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
dayjs_1.default.extend(utc_1.default);
const ISO_FORMAT = "YYYY-MM-DDTHH:mm:ss.sssZ";
class EventAttendantsClient {
    db;
    constructor(db) {
        this.db = db;
    }
    async getUserRsvpStatusToEvent(user_id, event_id) {
        const result = await this.db
            .selectFrom("event_attendants")
            .select("status")
            .where("user_id", "=", user_id)
            .where("event_id", "=", event_id)
            .executeTakeFirst();
        return result?.status ?? "not_going";
    }
    async getAllAttendanceRecords() {
        const raw = await this.db
            .selectFrom("event_attendants")
            .selectAll()
            .execute();
        return this.parseRawAttendants(raw);
    }
    async getAttendants(event_id) {
        const raw = await this.getRawAttendants(event_id);
        return this.parseRawAttendants(raw);
    }
    async updateAttendanceStatus(attendant, newStatus) {
        const updatedRaw = await this.upsertStatus(attendant, newStatus);
        return this.parseRawAttendant(updatedRaw);
    }
    async getUserAttendanceRecords(user_id) {
        const raw = await this.db
            .selectFrom("event_attendants")
            .selectAll()
            .where("user_id", "=", user_id)
            .execute();
        return this.parseRawAttendants(raw);
    }
    async getRawAttendants(event_id) {
        return await this.db
            .selectFrom("event_attendants")
            .selectAll()
            .where("event_id", "=", event_id)
            .execute();
    }
    async getRawAttendant(attendant) {
        return await this.db
            .selectFrom("event_attendants")
            .selectAll()
            .where("event_id", "=", attendant.event_id)
            .where("user_id", "=", attendant.user_id)
            .limit(1)
            .executeTakeFirstOrThrow();
    }
    async upsertStatus(attendant, newStatus) {
        const now = new Date();
        return await this.db
            .insertInto("event_attendants")
            .values({
            event_id: attendant.event_id,
            user_id: attendant.user_id,
            status: newStatus,
            created_at: now,
            updated_at: now,
        })
            .onConflict((oc) => oc.columns(["event_id", "user_id"]).doUpdateSet({
            status: newStatus,
            updated_at: now,
        }))
            .returningAll()
            .executeTakeFirstOrThrow();
    }
    parseRawAttendants(raw) {
        return raw.map((row) => {
            const created_at = (0, dayjs_1.default)(row.created_at).utc().format(ISO_FORMAT);
            const updated_at = row.updated_at
                ? (0, dayjs_1.default)(row.updated_at).utc().format(ISO_FORMAT)
                : null;
            return (0, schemaValidators_1.ValidateRawAttendants)({
                event_id: row.event_id,
                user_id: row.user_id,
                status: row.status,
                created_at,
                updated_at,
            });
        });
    }
    parseRawAttendant(row) {
        const created_at = (0, dayjs_1.default)(row.created_at).utc().format(ISO_FORMAT);
        const updated_at = row.updated_at
            ? (0, dayjs_1.default)(row.updated_at).utc().format(ISO_FORMAT)
            : null;
        return (0, schemaValidators_1.ValidateRawAttendants)({
            event_id: row.event_id,
            user_id: row.user_id,
            status: row.status,
            created_at,
            updated_at,
        });
    }
}
exports.EventAttendantsClient = EventAttendantsClient;
//# sourceMappingURL=eventAttendantsClient.js.map