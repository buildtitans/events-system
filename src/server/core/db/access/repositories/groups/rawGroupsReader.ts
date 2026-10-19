import { Kysely, Selectable, sql } from "kysely";
import { DB, Events, Groups } from "@/src/server/core/db/types/db";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type {
  EventPhaseSchemaType,
  TimelineElementSchemaType,
} from "@/src/schemas/groups/timelineSchema";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import { textSearchRelevance } from "@/src/server/core/lib/utils/queries/textSearchRelevance";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import {
  HydratedGroupRead,
  HydratedGroupResult,
  RawtimelineItem,
  ReadTimelineItem,
} from "./types";
import { assertNever } from "../../../../lib/asserts/assertNever";

export type RawArchives = {
  event: Selectable<Events>;
  attendance: {
    going: number;
    interested: number;
  };
}[];

export interface IGroupsReader {
  timeline(id: GroupSchemaType["id"]): Promise<RawtimelineItem[]>;
  allGroups(): Promise<Selectable<Groups>[]>;
  hydrateGroup(slug: GroupSchemaType["slug"]): Promise<HydratedGroupRead>;
  popularGroups(): Promise<Selectable<Groups>[]>;
  archivedEventsWithAttendance(id: GroupSchemaType["id"]): Promise<RawArchives>;
  rawSearchByName(query: string): Promise<Selectable<Groups>[]>;
  rawSuggestByName(query: string): Promise<Selectable<Groups>[]>;
  rawByCategoryId(id: CategorySchemaType["id"]): Promise<Selectable<Groups>[]>;
  rawByOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<Selectable<Groups>[]>;
}

export class RawGroupsReader implements IGroupsReader {
  constructor(private readonly db: Kysely<DB>) {}

  async hydrateGroup(
    slug: GroupSchemaType["slug"],
  ): Promise<HydratedGroupRead> {
    const result = await this.db
      .selectFrom("groups as g")
      .innerJoin("group_members as gm", "gm.group_id", "g.id")
      .innerJoin("categories as c", "g.category_id", "c.id")
      .innerJoin("users as u", "g.organizer_id", "u.id")
      .where("g.slug", "=", slug)
      .select((eb) => [
        "c.name as category_name",
        "g.id",
        "g.organizer_id",
        "g.updated_at",
        "g.created_at",
        "g.name",
        "g.category_id",
        "g.location",
        "g.slug",
        "g.description",
        "u.email as organizer_email",

        eb.fn
          .countAll<number>()
          .filterWhere("role", "in", ["member", "organizer"])
          .as("member_count"),

        jsonObjectFrom(
          eb
            .selectFrom("events as next")
            .leftJoin("event_attendants as a", "a.event_id", "next.id")
            .select((eb) => [
              "next.id",
              "next.group_id",
              "next.status",
              "next.starts_at",
              "next.img",
              "next.description",
              "next.tag",
              "next.title",
              "next.meeting_location",
              eb.fn
                .countAll()
                .filterWhere("a.status", "=", "going")
                .as("going_count"),
              eb.fn
                .countAll()
                .filterWhere("a.status", "=", "interested")
                .as("interested_count"),
            ])
            .whereRef("next.group_id", "=", "g.id")
            .where("next.status", "=", "scheduled")
            .where("next.starts_at", ">=", new Date())
            .groupBy("next.id")
            .orderBy("next.starts_at", "asc")
            .orderBy("next.id", "asc")
            .limit(1),
        ).as("next_event"),
      ])
      .groupBy(["g.id", "c.name", "u.email"])
      .executeTakeFirstOrThrow(); // row;

    return this.toRawHydratedGroupDto(result);
  }

  async timeline(id: GroupSchemaType["id"]): Promise<RawtimelineItem[]> {
    const result = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "e.group_id", "g.id")
      .leftJoin("event_attendants as ea", "e.id", "ea.event_id")
      .where("g.id", "=", id)
      .where("e.status", "=", "scheduled")
      .select((eb) => [
        "e.starts_at",
        "e.id",
        "e.group_id",
        "e.created_at",
        "e.img as image",
        eb.fn
          .countAll<number>()
          .filterWhere("ea.status", "=", "going")
          .as("number_attended"),

        eb
          .case()
          .when(
            eb.cast<string>("e.starts_at", "date"),
            "<",
            sql<string>`current_date`,
          )
          .then("past" as const)
          .when(
            eb.cast<string>("e.starts_at", "date"),
            "=",
            sql<string>`current_date`,
          )
          .then("today" as const)
          .else("upcoming" as const)
          .end()
          .as("timeline_status"),
      ])
      .groupBy("e.id")
      .execute();

    return this.toTimeline(result);
  }

  async popularGroups(): Promise<Selectable<Groups>[]> {
    return await this.db
      .selectFrom("groups")
      .leftJoin("group_members", "group_members.group_id", "groups.id")
      .selectAll("groups")
      .groupBy("groups.id")
      .having(
        (eb) =>
          eb.fn
            .countAll()
            .filterWhere("group_members.role", "in", ["member", "organizer"]),
        ">=",
        4,
      )
      .execute();
  }

  async archivedEventsWithAttendance(
    id: GroupSchemaType["id"],
  ): Promise<RawArchives> {
    const rows = await this.db
      .selectFrom("events")
      .leftJoin("event_attendants", "event_attendants.event_id", "events.id")
      .selectAll("events")
      .select((eb) => [
        eb.fn
          .countAll()
          .filterWhere("event_attendants.status", "=", "going")
          .as("going"),
        eb.fn
          .countAll()
          .filterWhere("event_attendants.status", "=", "interested")
          .as("interested"),
      ])
      .where("events.group_id", "=", id)
      .where("events.status", "=", "cancelled")
      .groupBy("events.id")
      .orderBy("events.starts_at", "desc")
      .execute();

    return rows.map(({ going, interested, ...event }) => ({
      event,
      attendance: {
        going: Number(going),
        interested: Number(interested),
      },
    }));
  }

  async allGroups(): Promise<Selectable<Groups>[]> {
    return this.db
      .selectFrom("groups")
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();
  }

  async rawByOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<Selectable<Groups>[]> {
    return await this.db
      .selectFrom("groups")
      .selectAll()
      .where("organizer_id", "=", organizer_id)
      .execute();
  }

  async rawSearchByName(query: string): Promise<Selectable<Groups>[]> {
    return this.db
      .selectFrom("groups")
      .selectAll()
      .where("name", "ilike", `%${query}%`)
      .orderBy(textSearchRelevance(sql.ref("groups.name"), query), "asc")
      .orderBy("name", "asc")
      .orderBy("id", "asc")
      .limit(25)
      .execute();
  }

  async rawSuggestByName(query: string): Promise<Selectable<Groups>[]> {
    return await this.db
      .selectFrom("groups")
      .selectAll()
      .where("name", "ilike", `%${query}%`)
      .orderBy(textSearchRelevance(sql.ref("groups.name"), query), "asc")
      .orderBy("name", "asc")
      .orderBy("id", "asc")
      .limit(5)
      .execute();
  }

  async rawByCategoryId(
    id: CategorySchemaType["id"],
  ): Promise<Selectable<Groups>[]> {
    return await this.db
      .selectFrom("groups")
      .selectAll()
      .where("category_id", "=", id)
      .execute();
  }

  private toRawHydratedGroupDto(
    result: HydratedGroupResult,
  ): HydratedGroupRead {
    const {
      organizer_email,
      organizer_id,
      category_name,
      member_count,
      next_event,
      created_at,
      updated_at,
      ...rest
    } = result;

    if (next_event) {
      const { starts_at, going_count, interested_count, ...event } = next_event;
      const startsAt = new Date(starts_at);

      return {
        group: {
          created_at: created_at.toISOString(),
          updated_at: updated_at.toISOString(),
          organizer_id,
          ...rest,
        },
        meta: {
          organizer_email: organizer_email,
          category_name: category_name,
          member_count: Number(member_count),
          next_event: {
            event: {
              ...event,
              starts_at: startsAt.toISOString(),
              starts_at_ms: startsAt.getTime(),
            },
            meta: {
              attendance: {
                going: Number(going_count),
                interested: Number(interested_count),
              },
              category_name,
            },
          },
        },
      };
    } else {
      return {
        group: {
          created_at: created_at.toISOString(),
          updated_at: updated_at.toISOString(),
          organizer_id,
          ...rest,
        },
        meta: {
          organizer_email: organizer_email,
          category_name: category_name ?? undefined,
          member_count: Number(member_count),
        },
      };
    }
  }

  toTimeline(items: ReadTimelineItem[]): TimelineElementSchemaType[] {
    return items.map((item) => this.toTimelineItem(item));
  }

  private toTimelineItem(item: ReadTimelineItem): TimelineElementSchemaType {
    const { timeline_status, starts_at, created_at, number_attended, ...rest } =
      item;
    const event = {
      starts_at_ms: starts_at.getTime(),
      starts_at: starts_at.toISOString(),
      created_at: created_at.toISOString(),
      ...rest,
    };

    switch (timeline_status) {
      case "upcoming": {
        return {
          event,
          timeline_status: timeline_status,
        };
      }
      case "past": {
        return {
          event,
          timeline_status,
          meta: {
            number_attendend: Number(number_attended),
          },
        };
      }

      case "today": {
        return {
          event,
          timeline_status,
          event_phase: this.toEventPhase(starts_at),
        };
      }

      default: {
        return assertNever(timeline_status);
      }
    }
  }

  private toEventPhase(scheduledDate: Date): EventPhaseSchemaType {
    const startsAtMs = scheduledDate.getTime();
    const endsAtMs = startsAtMs + 2 * 60 * 60 * 1000;
    const nowMs = Date.now();

    if (nowMs < startsAtMs) {
      return "upcoming";
    }

    if (nowMs < endsAtMs) {
      return "ongoing";
    }

    return "completed";
  }
}
