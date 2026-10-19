import { validateRouterInput } from "@/src/server/core/router/adaptors/validateRouterInput";
import { GroupIDForInsertSchema } from "@/src/schemas/groups/groupMembersSchema";
import { NewGroupInputSchema } from "@/src/schemas/groups/groupSchema";
import {
  router,
  publicProcedure,
  protectedProcedure,
} from "@/src/server/core/context/init";
import {
  GroupIdSchema,
  NewEventInputSchema,
  UpdateEventArgsSchema,
} from "@/src/schemas/events/eventSchema";
import { AttendanceUpdateInputSchema } from "@/src/schemas/events/eventAttendantsSchema";

const groupEventsRoute = router({
  nextEvent: publicProcedure
    .input(validateRouterInput(GroupIDForInsertSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.query.nextEventForGroup(
        input,
      );
    }),
  history: publicProcedure
    .input(validateRouterInput(GroupIDForInsertSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.timeline.getPastEventsForGroup(
        input,
      );
    }),
  list: publicProcedure
    .input(validateRouterInput(GroupIDForInsertSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.query.getGroupEvents(input);
    }),
});

const membersRoute = router({
  role: publicProcedure
    .input(validateRouterInput(GroupIdSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.users.select.roleInGroup(
        ctx.req.user?.id,
        input,
      );
    }),

  rsvp: protectedProcedure
    .input(validateRouterInput(AttendanceUpdateInputSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.users.write.rsvp(
        ctx.req.user?.id,
        input.event_id,
        input.newStatus,
      );
    }),

  joinGroup: protectedProcedure
    .input(validateRouterInput(GroupIdSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.users.write.joinGroup(
        ctx.req.user?.id,
        input,
      );
    }),

  leaveGroup: protectedProcedure
    .input(validateRouterInput(GroupIdSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.users.write.leaveGroup(
        input,
        ctx.req.user?.id,
      );
    }),
});

const organizerRoute = router({
  newGroup: protectedProcedure
    .input(validateRouterInput(NewGroupInputSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.groupLifecycle.createNewGroup(
        ctx.req.user?.id,
        input,
      );
    }),

  newEvent: protectedProcedure
    .input(validateRouterInput(NewEventInputSchema))
    .mutation(async ({ ctx, input }) => {
      return ctx.api.services.domains.events.lifecycle.createEvent(
        input,
        ctx.req.user?.id,
      );
    }),

  updateEvent: protectedProcedure
    .input(validateRouterInput(UpdateEventArgsSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.lifecycle.updateEventStatus(
        ctx.req.user?.id,
        input,
      );
    }),

  archives: protectedProcedure
    .input(validateRouterInput(GroupIDForInsertSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.archives(
        ctx.req.user?.id,
        input,
      );
    }),
});

export const groupRouter = router({
  events: groupEventsRoute,
  organizer: organizerRoute,
  member: membersRoute,
});
