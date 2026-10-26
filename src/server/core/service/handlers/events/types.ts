import type { EventSearchResultSchemaType } from "@/src/schemas/search/searchSchema";
import {
  GroupEventSummarySchemaType,
  EventSchemaType,
  HydratedEventSchemaType,
  NewEventInputSchemaType,
  UpdateEventArgsSchemaType,
  EventSurfaceSchemaType,
} from "@/src/schemas/events/eventSchema";
import { SearchSchemaType } from "@/src/schemas/search/searchSchema";
import { EventAttendantStatusSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { PaginatedLayoutSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import { HydratedEvent } from "@/src/server/core/service/types";
import {
  GroupSchemaType,
  NextEventForGroupSummarySchemaType,
} from "@/src/schemas//groups/groupSchema";
import { IDBClient } from "../../../db/access/client/dbClient";
import { GroupMemberSchemaType } from "../../../../../schemas/groups/groupMembersSchema";
import { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";

export type EventHydrationDb = Pick<
  IDBClient,
  "events" | "groupMembers" | "groups" | "eventAttendants"
>;

export type EventQueryDb = Pick<IDBClient, "events" | "eventAttendants">;

export type EventLayoutDb = Pick<IDBClient, "events" | "eventAttendants">;

export type EventTimelineDb = Pick<IDBClient, "events">;

export type EventLifecycleDb = Pick<IDBClient, "events">;

export interface IEventQueryHandler {
  hydrate(
    id: EventSchemaType["id"],
    userId?: AuthenticatedUserId,
  ): Promise<HydratedEventSchemaType>;
  nextEventForGroup(
    group_id: GroupSchemaType["id"],
  ): Promise<NextEventForGroupSummarySchemaType | undefined>;
}

export interface IEventLifecycleHandler {
  updateEventStatus(
    user_id: AuthenticatedUserId | undefined | null,
    statusUpdate: UpdateEventArgsSchemaType,
  ): Promise<{ updateStatus: "success" | "failure" }>;
  createEvent(
    newEvent: NewEventInputSchemaType,
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<
    { ok: true; data: EventSchemaType } | { ok: false; error: string }
  >;
}

export interface IEventLayoutHandler {
  discovery(): Promise<PaginatedLayoutSchemaType>;
  popular(): Promise<PaginatedLayoutSchemaType>;
  upcoming(): Promise<PaginatedLayoutSchemaType>;
  forGroup(id: GroupSchemaType["id"]): Promise<PaginatedLayoutSchemaType>;
}

export interface IEventLayoutComposer {
  compileLayout(events: EventSurfaceSchemaType[]): PaginatedLayoutSchemaType;
}

export type AttendanceAndRole = {
  rsvpStatus: EventAttendantStatusSchemaType;
  attendants: HydratedEvent["meta"]["attendants"];
  role: GroupMemberSchemaType["role"];
};
