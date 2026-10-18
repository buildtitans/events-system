import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { AuthenticatedUserId } from "../../../../service/handlers/session/SessionHandler";
import { GroupScheduleSchemaType } from "../../../../../../schemas/groups/userMembershipSchema";

export class RawGroupMembersReader {
  constructor(private readonly db: Kysely<DB>) {}

  async byUserId(user_id: AuthenticatedUserId) {
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

    return result.map((item) => {
      const {
        next_event_scheduled,
        todays_event,
        last_event_held,
        member_headcount,
        category_name,
        location,
        ...rest
      } = item;

      return {
        membership: {
          ...rest,
          location: location ?? "Online",
        },
        meta: {
          category_name: category_name ?? undefined,
          member_headcount: Number(member_headcount),
          schedule: this.toGroupSchedule(
            next_event_scheduled,
            todays_event,
            last_event_held,
          ),
        },
      };
    });
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

  private toGroupSchedule(
    next: Date | null,
    today: Date | null,
    past: Date | null,
  ): GroupScheduleSchemaType {
    if (next) {
      return {
        timeline_status: "upcoming",
        next_event_scheduled: next.toISOString(),
      };
    }

    if (today) {
      return {
        timeline_status: "today_only",
        todays_event: today.toISOString(),
      };
    }

    if (past) {
      return {
        timeline_status: "past_only",
        last_event_held: past.toISOString(),
      };
    }

    return { timeline_status: "no_events" };
  }
}
