import type { EventReadModelSchemaType } from "@/src/schemas/events/eventSchema";
import { EventHydrationHandler } from "@/src/server/core/service/handlers/events/eventHydrationHandler";
import {
  createMockDb,
  makeEvent,
  makeGroup,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("EventHydrationHandler", () => {
  const userId = "user-1";
  const eventId = "event-1";
  const groupId = "group-1";
  const group = makeGroup({ id: groupId });
  const event = makeEvent({ id: eventId, group_id: groupId });
  let handler: EventHydrationHandler;
  let db: ReturnType<typeof createMockDb>;
  let hydrateEvent: jest.Mock;
  let getRsvp: jest.Mock;
  let getRole: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    hydrateEvent = db.events.select.hydrate as jest.Mock;
    getRsvp = db.eventAttendants.select.rsvp as jest.Mock;
    getRole = db.groupMembers.select.role as jest.Mock;
    handler = new EventHydrationHandler(db);
  });

  describe("event", () => {
    it("combines the event read model with authenticated user metadata", async () => {
      const readModel: EventReadModelSchemaType = {
        event,
        meta: {
          group_name: group.name,
          group_slug: group.slug,
          attendants: { going: 2, interested: 1 },
        },
      };
      hydrateEvent.mockResolvedValue(readModel);
      getRsvp.mockResolvedValue("interested");
      getRole.mockResolvedValue("organizer");

      await expect(handler.event(userId, eventId)).resolves.toEqual({
        event,
        meta: {
          event: readModel.meta,
          user: { status: "interested", role: "organizer" },
        },
      });

      expect(hydrateEvent).toHaveBeenCalledWith(eventId);
      expect(getRsvp).toHaveBeenCalledWith(userId, eventId);
      expect(getRole).toHaveBeenCalledWith(userId, groupId);
      expect(db.events.select.byId).not.toHaveBeenCalled();
      expect(db.groups.select.byId).not.toHaveBeenCalled();
      expect(db.eventAttendants.select.attendants).not.toHaveBeenCalled();
    });

    it.each([undefined, null])(
      "uses anonymous metadata without user lookups when user ID is %s",
      async (anonymousUserId) => {
        const readModel: EventReadModelSchemaType = {
          event,
          meta: {
            group_name: group.name,
            group_slug: group.slug,
            attendants: { going: 1, interested: 1 },
          },
        };
        hydrateEvent.mockResolvedValue(readModel);

        await expect(handler.event(anonymousUserId, eventId)).resolves.toEqual({
          event,
          meta: {
            event: readModel.meta,
            user: { status: "not_going", role: "anonymous" },
          },
        });

        expect(hydrateEvent).toHaveBeenCalledWith(eventId);
        expect(getRsvp).not.toHaveBeenCalled();
        expect(getRole).not.toHaveBeenCalled();
      },
    );
  });
});
