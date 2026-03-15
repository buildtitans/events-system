import { Kysely } from "kysely";
import { DB, GroupMembers } from "../../types/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Selectable } from "kysely";
import {
  GroupMembersArraySchemaType,
  GroupMemberSchemaType,
  GroupRoleSchemaValidator,
  ValidateGroupMember,
  ValidateGroupMembersArray,
} from "@/src/schemas/groups/groupMembersSchema";
import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
dayjs.extend(utc);
const ISO_FORMAT = "YYYY-MM-DDTHH:mm:ss.sssZ";

type InsertableMember = Pick<GroupMemberSchemaType, "group_id" | "user_id">;

export class GroupMembersClient {
  constructor(private readonly db: Kysely<DB>) {}

  async getViewerMemberships(
    user_id: string,
  ): Promise<GroupMemberSchemaType[]> {
    const raw = await this.db
      .selectFrom("group_members")
      .selectAll()
      .where("user_id", "=", user_id)
      .execute();

    return this.parseRawMembers(raw);
  }

  async getMembershipRole(
    user_id: GroupMemberSchemaType["user_id"],
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType["role"]> {
    const raw = await this.db
      .selectFrom("group_members")
      .select("role")
      .where("group_id", "=", group_id)
      .where("user_id", "=", user_id)
      .executeTakeFirstOrThrow();
    return GroupRoleSchemaValidator(raw.role);
  }

  async getOrganizer(
    group_id: GroupMemberSchemaType["user_id"],
  ): Promise<GroupMemberSchemaType> {
    const raw = await this.db
      .selectFrom("group_members")
      .selectAll()
      .where("group_id", "=", group_id)
      .where("role", "=", "organizer")
      .limit(1)
      .executeTakeFirstOrThrow();

    const organizer = this.parseNewRawMember(raw);

    console.log({
      "Group Orgainzer": organizer,
    });

    return organizer;
  }

  async addOrganizer(
    organizer: InsertableMember,
  ): Promise<GroupMemberSchemaType> {
    const inserted = await this.db
      .insertInto("group_members")
      .values({
        group_id: organizer.group_id,
        user_id: organizer.user_id,
        role: "organizer",
      })
      .onConflict((c) =>
        c.columns(["group_id", "user_id"]).doUpdateSet({ role: "organizer" }),
      )
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.parseNewRawMember(inserted);
  }

  async addNewMember(
    newMember: Pick<GroupMemberSchemaType, "group_id" | "user_id">,
  ): Promise<GroupMemberSchemaType | null> {
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
  }

  async removeMember(
    user_id: GroupMemberSchemaType["user_id"],
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<boolean> {
    const result = await this.db
      .deleteFrom("group_members")
      .where("group_id", "=", group_id)
      .where("user_id", "=", user_id)
      .executeTakeFirstOrThrow();

    return Number(result.numDeletedRows) > 0 ? true : false;
  }

  async getGroupMembers(group_id: string): Promise<GroupMemberSchemaType[]> {
    const raw = await this.getRawMembers(group_id);

    const parsed = this.parseRawMembers(raw);

    return parsed;
  }

  async getMemberIds(group_id: string): Promise<string[]> {
    const members = await this.db
      .selectFrom("group_members")
      .select("user_id")
      .where("group_id", "=", group_id)
      .execute();

    return members.map((member) => member.user_id);
  }

  private async getRawMembers(
    group_id: string,
  ): Promise<Selectable<GroupMembers>[]> {
    return await this.db
      .selectFrom("group_members")
      .selectAll()
      .where("group_id", "=", group_id)
      .execute();
  }

  private parseNewRawMember(
    raw: Selectable<GroupMembers>,
  ): GroupMemberSchemaType {
    const joined = dayjs(raw.joined_at).utc().format(ISO_FORMAT);

    return ValidateGroupMember({
      group_id: raw.group_id,
      joined_at: joined,
      role: raw.role,
      user_id: raw.user_id,
    });
  }

  private parseMember(raw: Selectable<GroupMembers>): GroupMemberSchemaType {
    return ValidateGroupMember(raw);
  }

  private parseRawMembers(
    raw: Selectable<GroupMembers>[],
  ): GroupMembersArraySchemaType {
    const parsed = raw.map((row: Selectable<GroupMembers>) => {
      const joined = dayjs(row.joined_at).utc().format(ISO_FORMAT);

      const dto = {
        group_id: row.group_id,
        joined_at: joined,
        role: row.role,
        user_id: row.user_id,
      };

      return dto;
    });
    return ValidateGroupMembersArray(parsed);
  }
}
