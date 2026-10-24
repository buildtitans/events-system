import type {
  EventSearchResultSchemaType,
  EventSearchSuggestionSchemaType,
} from "@/src/schemas/search/searchSchema";
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
import { AuthenticatedUserId } from "../session/SessionHandler";

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
  searchEvents(query: SearchSchemaType): Promise<EventSearchResultSchemaType[]>;
  suggestEvents(
    query: SearchSchemaType,
  ): Promise<EventSearchSuggestionSchemaType[]>;
  getGroupEvents(group_id: string): Promise<GroupEventSummarySchemaType[]>;
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
  byIds(ids: EventSchemaType["id"][]): Promise<PaginatedLayoutSchemaType>;
  discovery(): Promise<PaginatedLayoutSchemaType>;
  forGroup(groupId: string): Promise<PaginatedLayoutSchemaType>;
  popular(): Promise<PaginatedLayoutSchemaType>;
  upcoming(): Promise<PaginatedLayoutSchemaType>;
}

export interface IEventLayoutComposer {
  compileLayout(events: EventSurfaceSchemaType[]): PaginatedLayoutSchemaType;
}

export type AttendanceAndRole = {
  rsvpStatus: EventAttendantStatusSchemaType;
  attendants: HydratedEvent["meta"]["attendants"];
  role: GroupMemberSchemaType["role"];
};
