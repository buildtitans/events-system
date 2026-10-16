import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  EventSchema,
  EventReadModelSchema,
  EventSchemaType,
  EventReadModelSchemaType,
} from "@/src/schemas/events/eventSchema";
import { Selectable } from "kysely";
import { Events } from "../../../types/db";

export interface IEventsValidator {
  events(rows: Selectable<Events>[]): EventSchemaType[];
  event(raw: Selectable<Events>): EventSchemaType;
  eventWithGroupDetails(data: unknown): EventReadModelSchemaType;
}

export class EventsValidator implements IEventsValidator {
  events(rows: Selectable<Events>[]): EventSchemaType[] {
    return rows.map((row) => {
      const startsAtMs = row.starts_at.getTime();

      return validateOrThrow(EventSchema, {
        id: String(row.id),
        img: row.img,
        tag: row.tag,
        title: row.title,
        description: row.description,
        starts_at_ms: startsAtMs,
        starts_at: row.starts_at.toISOString(),
        meeting_location: row.meeting_location,
        group_id: row.group_id,
        created_at: row.created_at.toISOString(),
        updated_at: row.updated_at ? row.updated_at.toISOString() : null,
        status: row.status,
      });
    });
  }

  eventWithGroupDetails(data: unknown): EventReadModelSchemaType {
    return validateOrThrow(EventReadModelSchema, data);
  }

  event(raw: Selectable<Events>): EventSchemaType {
    const startsAtMs = raw.starts_at.getTime();

    return validateOrThrow(EventSchema, {
      id: raw.id,
      tag: raw.tag,
      title: raw.title,
      description: raw.description,
      updated_at: raw.updated_at.toISOString(),
      created_at: raw.created_at.toISOString(),
      group_id: raw.group_id,
      starts_at: raw.starts_at.toISOString(),
      starts_at_ms: startsAtMs,
      img: raw.img,
      meeting_location: raw.meeting_location,
      status: raw.status,
    });
  }
}
