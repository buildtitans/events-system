import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { AuthenticatedUserId } from "../../../../../../service/handlers/session/SessionHandler";
import {
  GroupMembershipShape,
  IGroupMembersParser,
} from "../parse/groupMembersParser";

export interface IGroupMembersReader {
  memberships(user_id: AuthenticatedUserId): Promise<GroupMembershipShape[]>;
  role(
    group_id: GroupMemberSchemaType["group_id"],
    userId: AuthenticatedUserId,
  ): Promise<string>;
  rawMemberIds(group_id: GroupMemberSchemaType["group_id"]): Promise<string[]>;
}

export class GroupMembersReader implements IGroupMembersReader {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly parse: IGroupMembersParser,
  ) {}

  async memberships(
    user_id: AuthenticatedUserId,
  ): Promise<GroupMembershipShape[]> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const result = await this.db
      .selectFrom("group_members as gm")
      .innerJoin("groups as g", "gm.group_id", "g.id")
      .leftJoin("categories as c", "g.category_id", "c.id")
      .where("user_id", "=", user_id)
      .select((eb) => [
        "g.name as group_name",
        "g.slug as group_slug",
        "g.location as location",
        "c.name as category_name",
        "gm.role as roleInGroup",
        "g.description as group_description",
        "g.id as group_id",

        eb
          .selectFrom("group_members as members")
          .select((eb) => eb.fn.countAll().as("count"))
          .whereRef("members.group_id", "=", "g.id")
          .where("members.role", "in", ["member", "organizer"])
          .as("member_headcount"),

        eb
          .selectFrom("events as e")
          .select((eb) => eb.fn.min("e.starts_at").as("date"))
          .whereRef("e.group_id", "=", "g.id")
          .where("e.status", "=", "scheduled")
          .where("e.starts_at", ">=", tomorrowStart)
          .as("next_event_scheduled"),

        eb
          .selectFrom("events as e")
          .select((eb) => eb.fn.min("e.starts_at").as("date"))
          .whereRef("e.group_id", "=", "g.id")
          .where("e.status", "=", "scheduled")
          .where("e.starts_at", ">=", todayStart)
          .where("e.starts_at", "<", tomorrowStart)
          .as("todays_event"),

        eb
          .selectFrom("events as e")
          .select((eb) => eb.fn.max("e.starts_at").as("date"))
          .whereRef("e.group_id", "=", "g.id")
          .where("e.status", "=", "scheduled")
          .where("e.starts_at", "<", todayStart)
          .as("last_event_held"),
      ])
      .execute();

    return this.parse.toMemberships(result);
  }

  async role(
    group_id: GroupMemberSchemaType["group_id"],
    userId: AuthenticatedUserId,
  ): Promise<string> {
    const result = await this.db
      .selectFrom("group_members as gm")
      .where("gm.group_id", "=", group_id)
      .where("gm.user_id", "=", userId)
      .select("gm.role")
      .executeTakeFirst();

    return this.parse.toRole(result);
  }

  async rawMemberIds(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<string[]> {
    const rows = await this.db
      .selectFrom("group_members")
      .select(["user_id"])
      .where("group_id", "=", group_id)
      .execute();

    return this.parse.toMemberIds(rows);
  }
}
