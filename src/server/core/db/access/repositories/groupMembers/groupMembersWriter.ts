import { Kysely } from "kysely";
import { DB } from "../../../types/db";
import { GroupMembersValidator } from "./groupMembersValidator";
import { GroupMemberSchemaType } from "../../../../../../schemas/groups/groupMembersSchema";

type InsertableMember = Pick<GroupMemberSchemaType, "group_id" | "user_id">;

export class GroupMembersWriter {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly validator: GroupMembersValidator,
  ) {}

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

    return this.validator.member(inserted);
  }

  async newMember(
    newMember: Pick<GroupMemberSchemaType, "group_id" | "user_id">,
  ): Promise<GroupMemberSchemaType> {
    const inserted = await this.db
      .insertInto("group_members")
      .values({
        group_id: newMember.group_id,
        user_id: newMember.user_id,
        role: "member",
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.validator.member(inserted) ?? null;
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
}
