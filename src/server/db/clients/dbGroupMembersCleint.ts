import { Kysely } from "kysely";
import { DB, GroupMembers } from "../types/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type {
    Selectable
} from "kysely";
import {
    GroupMembersArraySchemaType,
    GroupMembersSchemaType,
    ValidateGroupMember,
    ValidateGroupMembersArray
} from "@/src/schemas/groupMembersSchema";
dayjs.extend(utc);
const ISO_FORMAT = "YYYY-MM-DDTHH:mm:ss.sssZ";

type InsertableMember = Pick<GroupMembersSchemaType, "group_id" | "user_id">


export class GroupMembersClient {

    constructor(private readonly db: Kysely<DB>) { }

    async getViewerMemberships(user_id: string): Promise<GroupMembersSchemaType[]> {

        const raw = await this.db
            .selectFrom("group_members")
            .selectAll()
            .where("user_id", "=", user_id)
            .execute();

        return this
            .parseRawMembers(raw);
    };


    async addOrganizer(organizer: InsertableMember): Promise<GroupMembersSchemaType> {

        const inserted = await this.db
            .insertInto("group_members")
            .values({
                group_id: organizer.group_id,
                user_id: organizer.user_id,
                role: "organizer"
            })
            .onConflict((c) =>
                c.columns(["group_id", "user_id"])
                    .doUpdateSet({ role: "organizer" })
            )
            .returningAll()
            .executeTakeFirstOrThrow()

        return this.parseNewRawMember(inserted);
    };

    async addNewMember(
        newMember: Pick<GroupMembersSchemaType, "group_id" | "user_id">
    ): Promise<GroupMembersSchemaType | null> {

        const inserted = await this.db
            .insertInto("group_members")
            .values({
                group_id: newMember.group_id,
                user_id: newMember.user_id,
                role: "member",
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        return this.parseNewRawMember(inserted) ?? null;
    };



    async getGroupMembers(group_id: string): Promise<GroupMembersSchemaType[]> {

        const raw = await this.getRawMembers(group_id);

        const parsed = this.parseRawMembers(raw);

        return parsed;
    }

    private async getRawMembers(group_id: string): Promise<Selectable<GroupMembers>[]> {

        return await this.db
            .selectFrom("group_members")
            .selectAll()
            .where("group_id", "=", group_id)
            .execute()
    }

    private parseNewRawMember(
        raw: Selectable<GroupMembers>
    ): GroupMembersSchemaType {

        const joined = dayjs(raw.joined_at)
            .utc()
            .format(ISO_FORMAT);

        return ValidateGroupMember({
            group_id: raw.group_id,
            joined_at: joined,
            role: raw.role,
            user_id: raw.user_id
        })
    };

    private parseRawMembers(
        raw: Selectable<GroupMembers>[]
    ): GroupMembersArraySchemaType {

        const parsed = raw.map((row: Selectable<GroupMembers>) => {

            const joined = dayjs(row.joined_at)
                .utc()
                .format(ISO_FORMAT);

            const dto = {
                group_id: row.group_id,
                joined_at: joined,
                role: row.role,
                user_id: row.user_id
            }

            return dto;
        });
        return ValidateGroupMembersArray(parsed);
    }
};