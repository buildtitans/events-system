import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  ArchivedEventSchemaType,
  GroupArchivesSchema,
  GroupDiscoverySchema,
  GroupDiscoverySummarySchemaType,
  GroupHydrationReadSchema,
  GroupHydrationReadSchemaType,
  GroupRefreshReadSchema,
  GroupRefreshReadSchemaType,
  GroupSchema,
  GroupsSchema,
  type GroupSchemaType,
  type GroupsSchemaType,
} from "@/src/schemas/groups/groupSchema";
import type { Selectable } from "kysely";
import type { Groups } from "@/src/server/core/db/types/db";
import {
  TimelineElementSchemaType,
  TimelineSchema,
} from "../../../../../../../../schemas/groups/timelineSchema";
import { RawArchives } from "../../types";
import {
  EventsForGoupSchema,
  GroupEventSummarySchemaType,
} from "../../../../../../../../schemas/events/eventSchema";
import { EventsValidator } from "@/src/server/core/db/access/repositories/events/handlers/validate/eventsValidator";

export interface IGroupsValidator {
  discovery(data: unknown): GroupDiscoverySummarySchemaType[];
  timeline(data: unknown): TimelineElementSchemaType[];
  hydrated(data: unknown): GroupHydrationReadSchemaType;
  groups(groups: Selectable<Groups>[]): GroupsSchemaType;
  eventsForGroup(data: unknown): GroupEventSummarySchemaType[];
  archives(archives: RawArchives): ArchivedEventSchemaType[];
  group(group: Selectable<Groups>): GroupSchemaType;
  refresh(data: unknown): GroupRefreshReadSchemaType;
}

export class GroupsValidator implements IGroupsValidator {
  constructor(private readonly eventsValidator: EventsValidator) {}

  refresh(data: unknown): GroupRefreshReadSchemaType {
    return validateOrThrow(GroupRefreshReadSchema, data);
  }

  discovery(data: unknown): GroupDiscoverySummarySchemaType[] {
    return validateOrThrow(GroupDiscoverySchema, data);
  }

  timeline(data: unknown): TimelineElementSchemaType[] {
    return validateOrThrow(TimelineSchema, data);
  }

  hydrated(data: unknown): GroupHydrationReadSchemaType {
    return validateOrThrow(GroupHydrationReadSchema, data);
  }

  groups(groups: Selectable<Groups>[]): GroupsSchemaType {
    const formatted = [];

    for (const group of groups) {
      const parsed = this.toGroupSchema(group);
      formatted.push(parsed);
    }

    const validGroups = validateOrThrow(GroupsSchema, formatted);
    return validGroups;
  }

  eventsForGroup(data: unknown): GroupEventSummarySchemaType[] {
    return validateOrThrow(EventsForGoupSchema, data);
  }

  archives(archives: RawArchives): ArchivedEventSchemaType[] {
    const events = this.eventsValidator.events(
      archives.map(({ event }) => event),
    );

    const normalized = archives.map(({ attendance }, index) => ({
      event: events[index],
      attendance,
    }));

    return validateOrThrow(GroupArchivesSchema, normalized);
  }

  group(group: Selectable<Groups>): GroupSchemaType {
    const raw = this.toGroupSchema(group);
    return validateOrThrow(GroupSchema, raw);
  }

  private toGroupSchema(group: Selectable<Groups>): GroupSchemaType {
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
}
