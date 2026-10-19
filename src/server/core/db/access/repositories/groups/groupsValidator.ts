import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  ArchivedEventSchemaType,
  GroupArchivesSchema,
  GroupHydratedSchema,
  GroupHydratedSchemaType,
  GroupSchema,
  GroupsSchema,
  type GroupSchemaType,
  type GroupsSchemaType,
} from "@/src/schemas/groups/groupSchema";
import type { Selectable } from "kysely";
import type { Groups } from "@/src/server/core/db/types/db";
import { EventsValidator } from "../events/eventsValidator";
import type { RawArchives } from "./rawGroupsReader";
import {
  TimelineElementSchemaType,
  TimelineSchema,
} from "../../../../../../schemas/groups/timelineSchema";

export class GroupsValidator {
  constructor(private readonly eventsValidator: EventsValidator) {}

  timeline(data: unknown): TimelineElementSchemaType[] {
    return validateOrThrow(TimelineSchema, data);
  }

  hydrated(data: unknown): GroupHydratedSchemaType {
    return validateOrThrow(GroupHydratedSchema, data);
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
