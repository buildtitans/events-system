"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMembersClient = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const groupMembersSchema_1 = require("@/src/schemas/groups/groupMembersSchema");
dayjs_1.default.extend(utc_1.default);
const ISO_FORMAT = "YYYY-MM-DDTHH:mm:ss.sssZ";
class GroupMembersClient {
    db;
    constructor(db) {
        this.db = db;
    }
    async getViewerMemberships(user_id) {
        const raw = await this.db
            .selectFrom("group_members")
            .selectAll()
            .where("user_id", "=", user_id)
            .execute();
        return this.parseRawMembers(raw);
    }
    async getMembershipRole(user_id, group_id) {
        const raw = await this.db
            .selectFrom("group_members")
            .selectAll()
            .where("group_id", "=", group_id)
            .where("user_id", "=", user_id)
            .executeTakeFirst();
        if (raw) {
            const parsed = this.parseRawMember(raw);
            return parsed.role;
        }
        else {
            return "anonymous";
        }
    }
    async getOrganizer(group_id) {
        const raw = await this.db
            .selectFrom("group_members")
            .selectAll()
            .where("group_id", "=", group_id)
            .where("role", "=", "organizer")
            .limit(1)
            .executeTakeFirstOrThrow();
        return this.parseRawMember(raw);
    }
    async addOrganizer(organizer) {
        const inserted = await this.db
            .insertInto("group_members")
            .values({
            group_id: organizer.group_id,
            user_id: organizer.user_id,
            role: "organizer",
        })
            .onConflict((c) => c.columns(["group_id", "user_id"]).doUpdateSet({ role: "organizer" }))
            .returningAll()
            .executeTakeFirstOrThrow();
        return this.parseRawMember(inserted);
    }
    async addNewMember(newMember) {
        const inserted = await this.db
            .insertInto("group_members")
            .values({
            group_id: newMember.group_id,
            user_id: newMember.user_id,
            role: "member",
        })
            .returningAll()
            .executeTakeFirstOrThrow();
        return this.parseRawMember(inserted) ?? null;
    }
    async removeMember(user_id, group_id) {
        const result = await this.db
            .deleteFrom("group_members")
            .where("group_id", "=", group_id)
            .where("user_id", "=", user_id)
            .executeTakeFirstOrThrow();
        return Number(result.numDeletedRows) > 0 ? true : false;
    }
    async getGroupMembers(group_id) {
        const raw = await this.getRawMembers(group_id);
        const parsed = this.parseRawMembers(raw);
        return parsed;
    }
    async getMemberIds(group_id) {
        const members = await this.db
            .selectFrom("group_members")
            .select("user_id")
            .where("group_id", "=", group_id)
            .execute();
        return members.map((member) => member.user_id);
    }
    async getMemberCountsByGroupIds(groupIds) {
        if (groupIds.length === 0)
            return {};
        const rows = await this.db
            .selectFrom("group_members")
            .select(({ fn, ref }) => [
            ref("group_id").as("group_id"),
            fn.count("user_id").as("member_count"),
        ])
            .where("group_id", "in", groupIds)
            .groupBy("group_id")
            .execute();
        const counts = {};
        for (const row of rows) {
            counts[row.group_id] = Number(row.member_count);
        }
        return (0, groupMembersSchema_1.MemberCountSchemaValidator)(counts);
    }
    async getRawMembers(group_id) {
        return await this.db
            .selectFrom("group_members")
            .selectAll()
            .where("group_id", "=", group_id)
            .execute();
    }
    parseRawMember(raw) {
        const joined = (0, dayjs_1.default)(raw.joined_at).utc().format(ISO_FORMAT);
        return (0, groupMembersSchema_1.ValidateGroupMember)({
            group_id: raw.group_id,
            joined_at: joined,
            role: raw.role,
            user_id: raw.user_id,
        });
    }
    parseRawMembers(raw) {
        const parsed = raw.map((row) => {
            const joined = (0, dayjs_1.default)(row.joined_at).utc().format(ISO_FORMAT);
            const dto = {
                group_id: row.group_id,
                joined_at: joined,
                role: row.role,
                user_id: row.user_id,
            };
            return dto;
        });
        return (0, groupMembersSchema_1.ValidateGroupMembersArray)(parsed);
    }
}
exports.GroupMembersClient = GroupMembersClient;
//# sourceMappingURL=GroupMembersClient.js.map