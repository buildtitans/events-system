import { Insertable, Kysely, Selectable } from "kysely";
import { DB, Groups } from "@/src/server/db/types/db";
import { GroupSchemaType, GroupsSchemaType, NewGroupInputSchemaType } from "@/src/schemas/groupSchema";
import { GroupSchemaValidator, GroupsSchemaValidator } from "@/src/server/validation/validateSchema";
import { slugify } from "@/src/lib/utils/helpers/slugify";

export class GroupsClient {
    constructor(private readonly db: Kysely<DB>) { }

    async getGroups(): Promise<GroupsSchemaType> {
        const raw = await this.getRawGroups();
        const formatted = this.formatRawGroups(raw);
        return formatted
    }

    async getRawGroups(): Promise<Selectable<Groups>[]> {
        return this.db
            .selectFrom("groups")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute()

    }

    formatRawGroups(groups: Selectable<Groups>[]): GroupsSchemaType {
        const formatted = [];

        for (const group of groups) {
            let parsed = this.formatGroup(group);
            formatted.push(parsed);
        }

        const validGroups = GroupsSchemaValidator(formatted);
        return validGroups;
    }

    async createGroup(newGroup: NewGroupInputSchemaType, organizer_id: string): Promise<GroupSchemaType | null> {
        console.log("************************* createGroup() hit *********************** ")

        const insertableGroup = this.parseNewGroup(newGroup, organizer_id)
        const inserted = await this.insertNewGroup(insertableGroup);
        console.log({ Sent: insertableGroup, Inserting: inserted });
        return this.toGroupSchema(inserted);
    }

    parseNewGroup(newGroup: NewGroupInputSchemaType, organizer_id: string): Insertable<Groups> {

        return {
            name: newGroup.name,
            slug: slugify(newGroup.name),
            description: newGroup.description,
            location: newGroup.location,
            category_id: newGroup.category_id,
            organizer_id: organizer_id
        }
    }


    async insertNewGroup(newGroup: Insertable<Groups>): Promise<Selectable<Groups>> {
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