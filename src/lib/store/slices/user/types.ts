import type { GroupDiscoverySummarySchemaType } from "@/src/schemas/groups/groupSchema";
import { RsvpSurfaceSchemaType } from "@/src/schemas/events/rsvpSchema";
import { UserMembershipSurfaceSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import { AsyncState } from "@/src/lib/types/state/types";

type UserAccountViewType = "memberships" | "rsvps" | "my groups";

export type UserEmailState = AsyncState<string, "No email found">;

type RsvpsState = AsyncState<
  RsvpSurfaceSchemaType[],
  "We couldn't find any records of user participations"
>;

type MembershipsState = AsyncState<
  UserMembershipSurfaceSchemaType[],
  "No records of any memberships"
>;

type MyGroupsState = AsyncState<GroupDiscoverySummarySchemaType[][], "No groups created yet">;

export type RequestPwResetState = AsyncState<{ ok: true }>;

export type PasswordResetState = AsyncState<{ ok: true }>;

export type {
  UserAccountViewType,
  MyGroupsState,
  RsvpsState,
  MembershipsState,
};
