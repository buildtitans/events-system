import { GroupDiscoverySummarySchemaType } from "../../../../../../schemas/groups/groupSchema";
import {
  EventPhaseSchemaType,
  TimelineElementSchemaType,
} from "../../../../../../schemas/groups/timelineSchema";
import {
  GroupSearchResultSchemaType,
  GroupSearchSuggestionSchemaType,
} from "../../../../../../schemas/search/searchSchema";
import { assertNever } from "../../../../lib/asserts/assertNever";
import {
  HydratedGroupRead,
  HydratedGroupResult,
  RawArchives,
  RawGroupForDiscovery,
  RawReadArchivedEvent,
  RawSearchResult,
  ReadTimelineItem,
} from "./types";

export interface IGroupsParser {
  toTimeline(items: ReadTimelineItem[]): TimelineElementSchemaType[];
  toHydratedGroup(result: HydratedGroupResult): HydratedGroupRead;
  toSuggestions(results: RawSearchResult[]): GroupSearchSuggestionSchemaType[];
  toDiscoveryGroups(
    rows: RawGroupForDiscovery[],
  ): GroupDiscoverySummarySchemaType[];
  toArchives(rows: RawReadArchivedEvent[]): RawArchives;
  toSearchResults(results: RawSearchResult[]): GroupSearchResultSchemaType[];
}

export class GroupsParser implements IGroupsParser {
  public toArchives(rows: RawReadArchivedEvent[]): RawArchives {
    return rows.map(({ going, interested, ...event }) => ({
      event,
      attendance: {
        going: Number(going),
        interested: Number(interested),
      },
    }));
  }

  public toHydratedGroup(result: HydratedGroupResult): HydratedGroupRead {
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

  public toSearchResults(
    results: RawSearchResult[],
  ): GroupSearchResultSchemaType[] {
    return results.map(
      ({ category_name, member_count, next_event_scheduled, ...group }) => ({
        kind: "group",
        data: {
          group,
          meta: {
            label: group.name,
            category_name,
            member_count: Number(member_count),
            ...(next_event_scheduled
              ? { next_event_scheduled: next_event_scheduled.toISOString() }
              : {}),
          },
        },
      }),
    );
  }

  public toSuggestions(
    results: RawSearchResult[],
  ): GroupSearchSuggestionSchemaType[] {
    return results.map(
      ({
        category_name,
        member_count,
        id,
        name,
        slug,
        description,
        location,
      }) => ({
        kind: "group",
        data: {
          group: { id, name, slug, description, location },
          meta: {
            label: name,
            group: { category_name, member_count: Number(member_count) },
          },
        },
      }),
    );
  }

  public toDiscoveryGroups(
    rows: RawGroupForDiscovery[],
  ): GroupDiscoverySummarySchemaType[] {
    return rows.map(({ category_name, member_count, next_event, ...group }) => {
      const metadata = { category_name, member_count: Number(member_count) };
      if (!next_event) {
        return { group, meta: { ...metadata, kind: "no_next_event" } };
      }
      const startsAt = new Date(next_event.starts_at);
      return {
        group,
        meta: {
          ...metadata,
          kind: "has_next_event",
          next_event: {
            event: {
              id: next_event.id,
              title: next_event.title,
              description: next_event.description,
              starts_at: startsAt.toISOString(),
              starts_at_ms: startsAt.getTime(),
            },
            meta: {
              attendance: {
                going: Number(next_event.going),
                interested: Number(next_event.interested),
              },
            },
          },
        },
      };
    });
  }

  public toTimeline(items: ReadTimelineItem[]): TimelineElementSchemaType[] {
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
