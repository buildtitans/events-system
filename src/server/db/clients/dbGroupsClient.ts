import { Kysely, Selectable } from "kysely";
import { DB, Groups } from "@/src/server/db/types/db";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { GroupSchemaValidator } from "@/src/server/validation/validateSchema";

export class GroupsClient {
    constructor(private readonly db: Kysely<DB>) { }

    async getGroups() {
        return this.db
            .selectFrom("groups")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute()
    }

    async createGroup(newGroup: GroupSchemaType): Promise<GroupSchemaType | null> {
        const inserted = await this.insertNewGroup(newGroup);
        return this.toGroupSchema(inserted);
    }


    async insertNewGroup(newGroup: GroupSchemaType): Promise<Selectable<Groups>> {
        return this.db
            .insertInto("groups")
            .values(newGroup)
            .returningAll()
            .executeTakeFirstOrThrow();
    }

    formatGroup(group: Selectable<Groups>): GroupSchemaType {
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

    toGroupSchema(group: Selectable<Groups> | null): GroupSchemaType | null {
        if (!group) return null;
        const formatted = this.formatGroup(group);
        const validGroup = GroupSchemaValidator(formatted);
        if (validGroup) return validGroup;
        return null;
    }
};