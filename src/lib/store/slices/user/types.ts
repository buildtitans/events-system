import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { AsyncState } from "@/src/lib/types/state/types";

type UserAccountViewType = "memberships" | "rsvps" | "my groups" | "settings";

export type UserEmailState = AsyncState<string, "No email found">;

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
  | { status: "ready"; data: GroupSchemaType[][] }
  | { status: "failed"; error: string };

type MyGroupsState = AsyncState<GroupSchemaType[][], "No groups created yet">;

type NextGroupEventLookupMapType = Record<
  GroupSchemaType["id"],
  EventSchemaType["starts_at"]
>;

export type {
  UserAccountViewType,
  ParticipationsType,
  MyGroupsType,
  NextGroupEventLookupMapType,
  MyGroupsState,
};
