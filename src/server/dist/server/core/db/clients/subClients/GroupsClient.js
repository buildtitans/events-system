"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsClient = void 0;
const validateSchema_1 = require("@/src/shared/utils/validation/validateSchema");
const slugify_1 = require("@/src/shared/utils/parsing/slugify");
class GroupsClient {
    db;
    constructor(db) {
        this.db = db;
    }
    async getGroups() {
        const raw = await this.getRawGroups();
        const formatted = this.formatRawGroups(raw);
        return formatted;
    }
    async searchGroups(query) {
        const raw = await this.db
            .selectFrom("groups")
            .selectAll()
            .where("name", "ilike", `%${query}%`)
            .execute();
        return this.formatRawGroups(raw);
    }
    async getGroupsByOrganizerId(user_id) {
        const raw = await this.db
            .selectFrom("groups")
            .selectAll()
            .where("organizer_id", "=", user_id)
            .execute();
        return this.formatRawGroups(raw);
    }
    async getRawGroups() {
        return this.db
            .selectFrom("groups")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute();
    }
    async getGroupBySlug(slug) {
        const raw = await this.rawGroupsBySlug(slug);
        return this.formatGroup(raw);
    }
    async rawGroupsBySlug(slug) {
        return await this.db
            .selectFrom("groups")
            .selectAll()
            .where("slug", "=", slug)
            .limit(1)
            .executeTakeFirstOrThrow();
    }
    formatRawGroups(groups) {
        const formatted = [];
        for (const group of groups) {
            const parsed = this.formatGroup(group);
            formatted.push(parsed);
        }
        const validGroups = (0, validateSchema_1.GroupsSchemaValidator)(formatted);
        return validGroups;
    }
    async createGroup(newGroup, organizer_id) {
        const insertableGroup = this.parseNewGroup(newGroup, organizer_id);
        const inserted = await this.insertNewGroup(insertableGroup);
        return this.toGroupSchema(inserted);
    }
    parseNewGroup(newGroup, organizer_id) {
        return {
            name: newGroup.name,
            slug: (0, slugify_1.slugify)(newGroup.name),
            description: newGroup.description,
            location: newGroup.location,
            category_id: newGroup.category_id ?? "",
            organizer_id: organizer_id,
        };
    }
    async insertNewGroup(newGroup) {
        return this.db
            .insertInto("groups")
            .values(newGroup)
            .returningAll()
            .executeTakeFirstOrThrow();
    }
    toGroupSchema(group) {
        const formatted = this.formatGroup(group);
        return (0, validateSchema_1.GroupSchemaValidator)(formatted);
    }
    formatGroup(group) {
        return {
            id: group.id,
            name: group.name,
            slug: group.slug,
            description: group.description,
            location: group.location,
            category_id: group.category_id,
            organizer_id: group.organizer_id,
            created_at: group.created_at.toISOString(),
            updated_at: group.updated_at.toISOString(),
        };
    }
}
exports.GroupsClient = GroupsClient;
//# sourceMappingURL=GroupsClient.js.map