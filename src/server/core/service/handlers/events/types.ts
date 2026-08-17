import {
  EventSchemaType,
  NewEventInputSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import { SearchSchemaType } from "@/src/schemas/search/searchSchema";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { PaginatedLayoutSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import {
  HydratedEvent,
  PastEventAttendanceLookup,
  PastEventsResults,
  UpComingEventsLookup,
} from "@/src/server/core/service/types";
import { GroupSchemaType } from "@/src/schemas//groups/groupSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";

export interface IEventQueryHandler {
  getAllEvents(): Promise<EventSchemaType[]>;
  allActive(): Promise<EventSchemaType[]>;
  nextEventForGroup(
    group_id: GroupSchemaType["id"],
  ): Promise<EventSchemaType | undefined>;
  searchEvents(query: SearchSchemaType): Promise<EventSchemaType[]>;
  suggestEvents(query: SearchSchemaType): Promise<EventSchemaType[]>;
  getEventById(event_id: string): Promise<EventSchemaType>;
  getEventAttendants(event_id: string): Promise<EventAttendantsSchemaType[]>;
  getGroupEvents(group_id: string): Promise<EventSchemaType[]>;
}

export interface IEventLifecycleHandler {
  updateEventStatus(
    user_id: string | null | undefined,
    statusUpdate: UpdateEventArgsSchemaType,
  ): Promise<{ updateStatus: "success" | "failure" }>;
  createEvent(
    newEvent: NewEventInputSchemaType,
    group_id: EventSchemaType["group_id"],
    user_id: string | undefined,
  ): Promise<
    { ok: true; data: EventSchemaType } | { ok: false; error: string }
  >;
}

export interface IEventLayoutHandler {
  byIds(ids: EventSchemaType["id"][]): Promise<PaginatedLayoutSchemaType>;
  all(): Promise<PaginatedLayoutSchemaType>;
  active(): Promise<PaginatedLayoutSchemaType>;
  forGroup(groupId: string): Promise<PaginatedLayoutSchemaType>;
}

export interface IEventTimelineHandler {
  getPastEventsForGroup(group_id: string): Promise<PastEventsResults>;
  getAttendantsOfPastEvents(ids: string[]): Promise<PastEventAttendanceLookup>;
  getArchivedGroupEvents(
    user_id: string | null | undefined,
    group_id: string,
  ): Promise<{
    archives: EventSchemaType[];
    archivedAttendanceRecords: PastEventAttendanceLookup;
  }>;
  getNextEventMap(ids: GroupSchemaType["id"][]): Promise<UpComingEventsLookup>;
}

export interface IEventHydrationHandler {
  openedEvent(
    user_id: string | undefined | null,
    event_id: string,
  ): Promise<HydratedEvent>;
  getUserRoleInGroup(
    user_id: string | undefined | null,
    event_id: string,
  ): Promise<GroupMemberSchemaType["role"]>;
}
