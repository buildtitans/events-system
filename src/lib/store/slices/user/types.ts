import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";

type UserAccountViewType = "memberships" | "rsvps" | "my groups" | "settings";

type UserEmailType =
  | { status: "initial" }
  | { status: "pending" }
  | { status: "ready"; data: string }
  | { status: "failed"; error: string };

type ParticipationsType =
  | { status: "initial" }
  | { status: "pending" }
  | {
      status: "ready";
      data: {
        rsvps: RsvpSchemaType[];
        memberships: UserMembershipSchemaType[];
      };
    }
  | { status: "failed"; error: string };

type MyGroupsType =
  | { status: "initial" }
  | { status: "pending" }
  | { status: "ready"; data: GroupSchemaType[] }
  | { status: "failed"; error: string };

type NextGroupEventLookupMapType = Record<
  GroupSchemaType["id"],
  EventSchemaType["starts_at"]
>;

export type {
  UserAccountViewType,
  UserEmailType,
  ParticipationsType,
  MyGroupsType,
  NextGroupEventLookupMapType,
};
