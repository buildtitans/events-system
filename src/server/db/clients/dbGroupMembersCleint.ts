import { Kysely } from "kysely";
import { DB, GroupMembers } from "../types/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type {
    Selectable
} from "kysely";
import { GroupMembersSchemaType, GroupMembersSchemaValidator } from "@/src/schemas/groupMembersSchema";
dayjs.extend(utc);

type InsertableMember = Pick<GroupMembersSchemaType, "group_id" | "user_id">


export class GroupMembersClient {

    constructor(private readonly db: Kysely<DB>) { }

    async getViewerMemberships(user_id: string): Promise<GroupMembersSchemaType[]> {

        const raw = await this.db.selectFrom("group_members").selectAll().where("user_id", "=", user_id).execute();

        const viewerMemberships = this.parseRawMembers(raw);

        return viewerMemberships;
    };


    async addOrganizer(organizer: InsertableMember): Promise<GroupMembersSchemaType> {

        const inserted = await this.db.insertInto("group_members").values({
            group_id: organizer.group_id,
            user_id: organizer.user_id,
            role: "organizer"
        })
            .onConflict((c) =>
                c.columns(["group_id", "user_id"]).doUpdateSet({ role: "organizer" })
            )
            .returningAll()
            .executeTakeFirstOrThrow()

        const parsedOrganizer = this.parseNewRawMember(inserted);

        return parsedOrganizer;
    }

    async addNewMember(newMember: Pick<GroupMembersSchemaType, "group_id" | "user_id">): Promise<GroupMembersSchemaType | null> {

        const inserted = await this.db
            .insertInto("group_members")
            .values({
                group_id: newMember.group_id,
                user_id: newMember.user_id,
                role: "member",
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        const member = this.parseNewRawMember(inserted);

        return member ?? null
    }

    parseNewRawMember(raw: Selectable<GroupMembers>): GroupMembersSchemaType {
        const { group_id, joined_at, role, user_id } = raw;

        const joined = dayjs(joined_at).utc().format('YYYY-MM-DDTHH:mm:ss.sssZ');

        const dto = {
            group_id: group_id,
            joined_at: joined,
            role: role,
            user_id: user_id
        }

        if (!GroupMembersSchemaValidator.Check(dto)) {
            throw new Error("Invalid group member row")
        };

        return dto as GroupMembersSchemaType
    }

    async getGroupMembers(group_id: string): Promise<GroupMembersSchemaType[]> {

        const raw = await this.getRawMembers(group_id);

        const parsed = this.parseRawMembers(raw);

        return parsed;
    }

    async getRawMembers(group_id: string): Promise<Selectable<GroupMembers>[]> {

        const results = await this.db.selectFrom("group_members").selectAll().where("group_id", "=", group_id).execute();

        return results ?? []
    }


    parseRawMembers(raw: Selectable<GroupMembers>[]): GroupMembersSchemaType[] {

        const parsed = raw.map((row: Selectable<GroupMembers>) => {

            const {
                group_id,
                joined_at,
                role,
                user_id
            } = row;

            const joined = dayjs(joined_at)
                .utc()
                .format('YYYY-MM-DDTHH:mm:ss.sssZ');

            const dto = {
                group_id: group_id,
                joined_at: joined,
                role: role,
                user_id: user_id
            }

            if (!GroupMembersSchemaValidator.Check(dto)) {
                throw new Error("Invalid group member row")
            };

            return dto as GroupMembersSchemaType
        });
        return parsed
    }
};