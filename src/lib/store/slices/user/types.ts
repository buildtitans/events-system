import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { AsyncState } from "@/src/lib/types/state/types";

type UserAccountViewType = "memberships" | "rsvps" | "my groups" | "settings";

export type UserEmailState = AsyncState<string, "No email found">;

type ParticipationsStatePayload = {
  rsvps: RsvpSchemaType[];
  memberships: UserMembershipSchemaType[];
};

type PariticpationsState = AsyncState<
  ParticipationsStatePayload,
  "We couldn't find any records of user participations"
>;

type MyGroupsState = AsyncState<GroupSchemaType[][], "No groups created yet">;

type NextGroupEventLookupMapType = Record<
  GroupSchemaType["id"],
  EventSchemaType["starts_at"]
>;

export type RequestPwResetState = AsyncState<{ ok: true }>;

export type PasswordResetState = AsyncState<{ ok: true }>;

export type {
  UserAccountViewType,
  NextGroupEventLookupMapType,
  MyGroupsState,
  PariticpationsState,
  ParticipationsStatePayload,
};
