import { AsyncState } from "@/src/lib/types/state/types";
import { EventAttendantStatusSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { LayoutSlotSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export type EventDisplayFilter =
  | "All Events"
  | "Popular Events"
  | "Upcoming events"
  | "Local events"
  | "Tech Events";

export type GroupNameByGroupID = Record<string, string>;

export type EventsPages = Array<LayoutSlotSchemaType[]>;

export type EventsStateType = AsyncState<EventsPages, "No events found">;

export type HydrateEventDrawerPayload = {
  event: EventSchemaType;
  meta: {
    rsvpStatus: EventAttendantStatusSchemaType;
    attendants: {
      going: number;
      interested: number;
    };
    role: GroupMemberSchemaType["role"];
    name: GroupSchemaType["name"];
    slug: GroupSchemaType["slug"];
  };
};
