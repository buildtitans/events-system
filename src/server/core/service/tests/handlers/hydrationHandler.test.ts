import { EventHydrationHandler } from "@/src/server/core/service/handlers/events/eventHydrationHandler";
import {
  createMockDb,
  makeAttendanceUpdate,
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
  let getEventInDb: jest.Mock;
  let getAttendantsInDb: jest.Mock;
  let getUserRsvpStatusToEventInDb: jest.Mock;
  let getMembershipRoleInDb: jest.Mock;
  let getEventMetaData: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    getEventInDb = db.events.select.byId as jest.Mock;
    getAttendantsInDb = db.eventAttendants.select.attendants as jest.Mock;
    getUserRsvpStatusToEventInDb = db.eventAttendants.select.rsvp as jest.Mock;
    getMembershipRoleInDb = db.groupMembers.select.role as jest.Mock;
    getEventMetaData = db.groups.select.byId as jest.Mock;
    handler = new EventHydrationHandler(db);
  });

  describe("openedEvent", () => {
    it("returns the hydrated event data for an authenticated user", async () => {
      getUserRsvpStatusToEventInDb.mockResolvedValue("interested");
      getAttendantsInDb.mockResolvedValue([
        makeAttendanceUpdate({ event_id: eventId, user_id: "att-1" }, "going"),
        makeAttendanceUpdate({ event_id: eventId, user_id: "att-2" }, "going"),
        makeAttendanceUpdate(
          { event_id: eventId, user_id: "att-3" },
          "interested",
        ),
        makeAttendanceUpdate(
          { event_id: eventId, user_id: "att-4" },
          "not_going",
        ),
      ]);
      getEventInDb.mockResolvedValue(
        makeEvent({ id: eventId, group_id: groupId }),
      );
      getMembershipRoleInDb.mockResolvedValue("organizer");
      getEventMetaData.mockResolvedValue(group);

      await expect(handler.openedEvent(userId, eventId)).resolves.toEqual({
        event,
        meta: {
          rsvpStatus: "interested",
          attendants: {
            going: 2,
            interested: 1,
          },
          role: "organizer",
          name: group.name,
          slug: group.slug,
        },
      });

      expect(getUserRsvpStatusToEventInDb).toHaveBeenCalledWith(
        userId,
        eventId,
      );
      expect(getAttendantsInDb).toHaveBeenCalledWith(eventId);
      expect(getEventInDb).toHaveBeenCalledWith(eventId);
      expect(getMembershipRoleInDb).toHaveBeenCalledWith(userId, groupId);
    });

    it("returns anonymous hydration data for a viewer who is not signed in", async () => {
      getAttendantsInDb.mockResolvedValue([
        makeAttendanceUpdate({ event_id: eventId, user_id: "att-1" }, "going"),
        makeAttendanceUpdate(
          { event_id: eventId, user_id: "att-2" },
          "interested",
        ),
      ]);
      getEventInDb.mockResolvedValue(
        makeEvent({ id: eventId, group_id: groupId }),
      );
      getEventMetaData.mockResolvedValue(group);

      await expect(handler.openedEvent(undefined, eventId)).resolves.toEqual({
        event,
        meta: {
          rsvpStatus: "not_going",
          attendants: {
            going: 1,
            interested: 1,
          },
          role: "anonymous",
          name: group.name,
          slug: group.slug,
        },
      });

      expect(getUserRsvpStatusToEventInDb).not.toHaveBeenCalled();
      expect(getAttendantsInDb).toHaveBeenCalledWith(eventId);
      expect(getEventInDb).toHaveBeenCalledWith(eventId);
      expect(getMembershipRoleInDb).not.toHaveBeenCalled();
    });
  });

  describe("getUserRoleInGroup", () => {
    it("returns the membership role when the user and event exist", async () => {
      getEventInDb.mockResolvedValue(
        makeEvent({ id: eventId, group_id: groupId }),
      );
      getMembershipRoleInDb.mockResolvedValue("member");

      await expect(handler.getUserRoleInGroup(userId, eventId)).resolves.toBe(
        "member",
      );

      expect(getEventInDb).toHaveBeenCalledWith(eventId);
      expect(getMembershipRoleInDb).toHaveBeenCalledWith(userId, groupId);
    });

    it("returns anonymous when the event cannot be found", async () => {
      getEventInDb.mockResolvedValue(null);

      await expect(handler.getUserRoleInGroup(userId, eventId)).resolves.toBe(
        "anonymous",
      );

      expect(getEventInDb).toHaveBeenCalledWith(eventId);
      expect(getMembershipRoleInDb).not.toHaveBeenCalled();
    });
  });
});
