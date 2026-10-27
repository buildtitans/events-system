import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  EventSchema,
  EventSchemaType,
  EventDiscoverySummarySchemaType,
  EventsForDiscoverySchema,
  GroupEventSummarySchemaType,
  EventsForGoupSchema,
  HydratedEventSchema,
  HydratedEventSchemaType,
  EventsArraySchema,
} from "@/src/schemas/events/eventSchema";
import { Selectable } from "kysely";
import { Events } from "@/src/server/core/db/types/db";
import {
  NextEventForGroupSummarySchema,
  NextEventForGroupSummarySchemaType,
} from "@/src/schemas/groups/groupSchema";

export interface IEventsValidator {
  hydratedEvent(data: unknown): HydratedEventSchemaType;
  events(data: unknown): EventSchemaType[];
  event(raw: unknown): EventSchemaType;
  eventsForDiscovery(data: unknown[]): EventDiscoverySummarySchemaType[];
  eventsForGroup(data: unknown): GroupEventSummarySchemaType[];
  nextEvent(event: unknown): NextEventForGroupSummarySchemaType;
}

export class EventsValidator implements IEventsValidator {
  events(data: unknown): EventSchemaType[] {
    return validateOrThrow(EventsArraySchema, data);
  }

  nextEvent(event: unknown): NextEventForGroupSummarySchemaType {
    return validateOrThrow(NextEventForGroupSummarySchema, event);
  }

  eventsForDiscovery(data: unknown[]): EventDiscoverySummarySchemaType[] {
    return validateOrThrow(EventsForDiscoverySchema, data);
  }

  eventsForGroup(data: unknown): GroupEventSummarySchemaType[] {
    return validateOrThrow(EventsForGoupSchema, data);
  }

  hydratedEvent(data: unknown): HydratedEventSchemaType {
    return validateOrThrow(HydratedEventSchema, data);
  }

  event(data: unknown): EventSchemaType {
    return validateOrThrow(EventSchema, data);
  }
}
