import { Insertable, Kysely, Selectable } from "kysely";
import { DB, Groups } from "@/src/server/db/types/db";
import { GroupSchemaType, GroupsSchemaType, NewGroupInputSchemaType } from "@/src/schemas/groups/groupSchema";
import { GroupSchemaValidator, GroupsSchemaValidator } from "@/src/lib/utils/validation/validateSchema";
import { slugify } from "@/src/lib/utils/helpers/slugify";


export class GroupsClient {
    constructor(private readonly db: Kysely<DB>) { }

    async getGroups(): Promise<GroupsSchemaType> {
        const raw = await this.getRawGroups();
        const formatted = this.formatRawGroups(raw);
        return formatted
    }

    private async getRawGroups(): Promise<Selectable<Groups>[]> {
        return this.db
            .selectFrom("groups")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute()

    }

    async getGroupBySlug(slug: GroupSchemaType["slug"]): Promise<GroupSchemaType> {

        const raw = await this.rawGroupsBySlug(slug);

        return this.formatGroup(raw)
    }


    private async rawGroupsBySlug(slug: GroupSchemaType["slug"]): Promise<Selectable<Groups>> {

        return await this.db
            .selectFrom("groups")
            .selectAll()
            .where("slug", "=", slug)
            .limit(1)
            .executeTakeFirstOrThrow()
    }

    private formatRawGroups(groups: Selectable<Groups>[]): GroupsSchemaType {
        const formatted = [];

        for (const group of groups) {
            const parsed = this.formatGroup(group);
            formatted.push(parsed);
        }

        const validGroups = GroupsSchemaValidator(formatted);
        return validGroups;
    }

    async createGroup(newGroup: NewGroupInputSchemaType, organizer_id: string): Promise<GroupSchemaType | null> {

        const insertableGroup = this.parseNewGroup(newGroup, organizer_id)
        const inserted = await this.insertNewGroup(insertableGroup);
        return this.toGroupSchema(inserted);
    }

    private parseNewGroup(newGroup: NewGroupInputSchemaType, organizer_id: string): Insertable<Groups> {

        return {
            name: newGroup.name,
            slug: slugify(newGroup.name),
            description: newGroup.description,
            location: newGroup.location,
            category_id: newGroup.category_id,
            organizer_id: organizer_id
        }
    }


    private async insertNewGroup(newGroup: Insertable<Groups>): Promise<Selectable<Groups>> {
        return this.db
            .insertInto("groups")
            .values(newGroup)
            .returningAll()
            .executeTakeFirstOrThrow();
    }

    private formatGroup(group: Selectable<Groups>): GroupSchemaType {
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

    private toGroupSchema(group: Selectable<Groups> | null): GroupSchemaType | null {
        if (!group) return null;
        const formatted = this.formatGroup(group);
        const validGroup = GroupSchemaValidator(formatted);
        if (validGroup) return validGroup;
        return null;
    }
};