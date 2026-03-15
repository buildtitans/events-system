import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";

export type AttendantCountType = {
  numGoing: number;
  numInterested: number;
};

export type GroupNameLookupMap = Record<
  GroupSchemaType["id"],
  { name: GroupSchemaType["name"]; slug: GroupSchemaType["slug"] }
>;

export type UpComingEventsLookup = Record<
  GroupSchemaType["id"],
  EventSchemaType["starts_at"]
>;

export type NewOrganizerInput = Pick<
  GroupMemberSchemaType,
  "user_id" | "group_id"
>;

export type GroupCreatedResult = {
  group: GroupSchemaType;
  organizer: GroupMemberSchemaType;
};

export type GroupAction =
  | "manage group"
  | "manage events"
  | "change membership";

//recover: publicProcedure.mutation(async ({ ctx }) => {
//  const session = await ctx.service.api.session.recoverSession(
//    ctx.req.cookies.session,
//  );
//
//  if (!session) {
//    ctx.session.removeCookieHeader();
//  }
//
//  const email = await ctx.service.api.userClient.getEmailById(
//    session?.user_id,
//  );
//
//  const permissions = ctx.service.api.userClient.getRoleBasedLayoutMap(
//    session?.user_id,
//  );
//
//  return {
//    session,
//    email,
//    permissions,
//  };
//}),
