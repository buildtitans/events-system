import { EventHydrationHandler } from "@/src/server/core/service/handlers/eventHydrationHandler";
import {
  dbMock,
  makeAttendanceUpdate,
  makeEvent,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("EventHydrationHandler", () => {
  const getEventInDb = dbMock.events.getEvent as jest.Mock;
  const getAttendantsInDb = dbMock.eventAttendants.getAttendants as jest.Mock;
  const getUserRsvpStatusToEventInDb = dbMock.eventAttendants
    .getUserRsvpStatusToEvent as jest.Mock;
  const getMembershipRoleInDb = dbMock.groupMembers
    .getMembershipRole as jest.Mock;

  const userId = "user-1";
  const eventId = "event-1";
  const groupId = "group-1";

  let handler: EventHydrationHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    handler = new EventHydrationHandler(dbMock);
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

      await expect(handler.openedEvent(userId, eventId)).resolves.toEqual({
        rsvpStatus: "interested",
        attendants: {
          going: 2,
          interested: 1,
        },
        role: "organizer",
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

      await expect(handler.openedEvent(undefined, eventId)).resolves.toEqual({
        rsvpStatus: "not_going",
        attendants: {
          going: 1,
          interested: 1,
        },
        role: "anonymous",
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
