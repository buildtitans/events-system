import { Kysely, Selectable } from "kysely";
import { DB, GroupMembers } from "@/src/server/core/db/types/db";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";

export class RawGroupMembersReader {
  constructor(private readonly db: Kysely<DB>) {}

  async allRawMembers(): Promise<Selectable<GroupMembers>[]> {
    return await this.db.selectFrom("group_members").selectAll().execute();
  }

  async rawByUserId(
    user_id: GroupMemberSchemaType["user_id"],
  ): Promise<Selectable<GroupMembers>[]> {
    return await this.db
      .selectFrom("group_members")
      .selectAll()
      .where("user_id", "=", user_id)
      .execute();
  }

  async rawByGroupId(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<Selectable<GroupMembers>[]> {
    return await this.db
      .selectFrom("group_members")
      .selectAll()
      .where("group_id", "=", group_id)
      .execute();
  }

  async rawRoleInGroup(
    user_id: GroupMemberSchemaType["user_id"],
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<{ role: string } | undefined> {
    return await this.db
      .selectFrom("group_members")
      .where("user_id", "=", user_id)
      .where("group_id", "=", group_id)
      .select("role")
      .orderBy("joined_at", "asc")
      .executeTakeFirst();
  }

  async rawOrganizer(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<Selectable<GroupMembers>> {
    return await this.db
      .selectFrom("group_members")
      .selectAll()
      .where("group_id", "=", group_id)
      .where("role", "=", "organizer")
      .executeTakeFirstOrThrow();
  }

  async rawMemberIds(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<string[]> {
    const rows = await this.db
      .selectFrom("group_members")
      .select(["user_id"])
      .where("group_id", "=", group_id)
      .execute();

    return rows.map((row) => row.user_id);
  }

  async rawMemberCounts(groupIds: GroupMemberSchemaType["group_id"][]): Promise<
    {
      group_id: string;
      member_count: string | number | bigint;
    }[]
  > {
    return await this.db
      .selectFrom("group_members")
      .select(({ fn, ref }) => [
        ref("group_id").as("group_id"),
        fn.count("user_id").as("member_count"),
      ])
      .where("group_id", "in", groupIds)
      .groupBy("group_id")
      .execute();
  }
}
