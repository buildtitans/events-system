import type { RBACType } from "@/src/server/src/db/clients/types/types";
import type { AttendanceDictionaryType } from "@/src/server/src/lib/utils/mapAttendanceDictionary";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";

type UserAccountViewType = "memberships" | "rsvps" | "my groups" | "settings";

type UserEmailType =
  | { status: "initial" }
  | { status: "pending" }
  | { status: "ready"; data: string }
  | { status: "failed"; error: string };

type RSVPdEvents = {
  name: GroupSchemaType["name"];
} & Pick<
  EventSchemaType,
  "title" | "starts_at" | "starts_at_ms" | "status" | "meeting_location" | "id"
>;

type ParticipationsType =
  | { status: "initial" }
  | { status: "pending" }
  | {
      status: "ready";
      data: {
        rsvps: RSVPdEvents;
        memberships: RBACType;
      };
    }
  | { status: "failed"; error: string };

type MyGroupsType =
  | { status: "initial" }
  | { status: "pending" }
  | { status: "ready"; data: GroupSchemaType[] }
  | { status: "failed"; error: string };

export type {
  UserAccountViewType,
  UserEmailType,
  ParticipationsType,
  MyGroupsType,
  RSVPdEvents,
};
