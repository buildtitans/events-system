import { ParticipationsService } from "@/src/server/core/service/services/participationsService";
import {
  dbMock,
  policyMock,
  makeEvent,
  makeAttendanceUpdate,
  rsvps,
  groups,
  events,
  authenticateAs,
  unauthenticated,
} from "@/src/server/core/service/tests/mockers/mocks";
import {
  USER_ID,
  EVENT_ID,
  EVENT_ID_1,
  EVENT_ID_2,
  EVENT_ID_3,
} from "@/src/server/core/service/tests/mockers/mockValues";
import { EventAttendantStatusSchemaType } from "@/src/schemas/events/eventAttendantsSchema";

describe("ParticipationsService", () => {
  const updateAttendanceStatusInDb = dbMock.eventAttendants
    .updateAttendanceStatus as jest.Mock;
  const getUserRsvpStatusToEventInDb = dbMock.eventAttendants
    .getUserRsvpStatusToEvent as jest.Mock;
  const getUserAttendanceRecordsInDb = dbMock.eventAttendants
    .getUserAttendanceRecords as jest.Mock;
  const getEvents = dbMock.events.getEvents as jest.Mock;
  const getGroupsInDb = dbMock.groups.getGroups as jest.Mock;

  const getFlattenedEventsByIdsInDb = dbMock.events
    .getFlattenedEventsByIds as jest.Mock;

  let service: ParticipationsService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new ParticipationsService(dbMock, policyMock);
  });

  describe("updateRsvpStatus", () => {
    const newStatus: EventAttendantStatusSchemaType = "going";

    it("throws a 401 error when the user is not authenticated", async () => {
      unauthenticated();

      await expect(
        service.rsvps.updateRsvpStatus(null, EVENT_ID, newStatus),
      ).rejects.toThrow("401");

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(null);
      expect(updateAttendanceStatusInDb).not.toHaveBeenCalled();
    });

    it("updates the attendance status when the user is authenticated", async () => {
      authenticateAs();

      updateAttendanceStatusInDb.mockResolvedValue(
        makeAttendanceUpdate(
          { user_id: USER_ID, event_id: EVENT_ID },
          newStatus,
        ),
      );

      await expect(
        service.rsvps.updateRsvpStatus(USER_ID, EVENT_ID, newStatus),
      ).resolves.toMatchObject(
        makeAttendanceUpdate(
          { user_id: USER_ID, event_id: EVENT_ID },
          newStatus,
        ),
      );

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
      expect(updateAttendanceStatusInDb).toHaveBeenCalledWith(
        { event_id: EVENT_ID, user_id: USER_ID },
        newStatus,
      );
    });
  });

  describe("getUserRsvpToEvent", () => {
    it("throws a 401 error when the user is not authenticated", async () => {
      unauthenticated();

      await expect(
        service.rsvps.getUserRsvpToEvent(undefined, EVENT_ID),
      ).rejects.toThrow("401");

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(undefined);
      expect(getUserRsvpStatusToEventInDb).not.toHaveBeenCalled();
    });

    it("gets the RSVP status of an authenticated user", async () => {
      authenticateAs();

      getUserRsvpStatusToEventInDb.mockResolvedValue("going");

      await expect(
        service.rsvps.getUserRsvpToEvent(USER_ID, EVENT_ID),
      ).resolves.toEqual("going");

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
      expect(getUserRsvpStatusToEventInDb).toHaveBeenCalledWith(
        USER_ID,
        EVENT_ID,
      );
    });
  });

  describe("getAttendanceDictionary", () => {
    const records = [
      makeAttendanceUpdate({ event_id: EVENT_ID_1 }, "going"),
      makeAttendanceUpdate({ event_id: EVENT_ID_2 }, "interested"),
      makeAttendanceUpdate({ event_id: EVENT_ID_3 }, "not_going"),
    ];

    it("returns an attendance dictionary lookup for an authenticated user", async () => {
      authenticateAs();

      getEvents.mockResolvedValue([
        makeEvent({ id: EVENT_ID_1 }),
        makeEvent({ id: EVENT_ID_2 }),
        makeEvent({ id: EVENT_ID_3 }),
      ]);

      getUserAttendanceRecordsInDb.mockResolvedValue(records);

      await expect(
        service.rsvps.getAttendanceDictionary(USER_ID),
      ).resolves.toMatchObject({
        [EVENT_ID_1]: "going",
        [EVENT_ID_2]: "interested",
        [EVENT_ID_3]: "not_going",
      });

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
      expect(getUserAttendanceRecordsInDb).toHaveBeenCalledWith(USER_ID);
    });
  });

  describe("getRsvpdEvents", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-04-01T00:00:00.000Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("throws a 401 error when the user is not authenticated", async () => {
      unauthenticated();

      await expect(service.rsvps.getRsvpdEvents(null)).rejects.toThrow("401");

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(null);
      expect(getGroupsInDb).not.toHaveBeenCalled();
      expect(getUserAttendanceRecordsInDb).not.toHaveBeenCalled();
      expect(getFlattenedEventsByIdsInDb).not.toHaveBeenCalled();
    });

    it("returns an array of the authenticated user's RSVPs", async () => {
      authenticateAs();

      getGroupsInDb.mockResolvedValue(groups);

      getUserAttendanceRecordsInDb.mockResolvedValue([
        makeAttendanceUpdate(
          { event_id: EVENT_ID_1, user_id: USER_ID },
          "going",
        ),
        makeAttendanceUpdate(
          { event_id: EVENT_ID_2, user_id: USER_ID },
          "interested",
        ),
        makeAttendanceUpdate(
          { event_id: EVENT_ID_3, user_id: USER_ID },
          "going",
        ),
      ]);

      getFlattenedEventsByIdsInDb
        .mockResolvedValueOnce(events)
        .mockResolvedValueOnce(events);

      await expect(service.rsvps.getRsvpdEvents(USER_ID)).resolves.toEqual(
        rsvps,
      );

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
      expect(getGroupsInDb).toHaveBeenCalled();
      expect(getUserAttendanceRecordsInDb).toHaveBeenCalled();
      expect(getFlattenedEventsByIdsInDb).toHaveBeenCalledTimes(2);
      expect(getFlattenedEventsByIdsInDb).toHaveBeenNthCalledWith(1, [
        EVENT_ID_1,
        EVENT_ID_2,
        EVENT_ID_3,
      ]);
      expect(getFlattenedEventsByIdsInDb).toHaveBeenNthCalledWith(2, [
        EVENT_ID_1,
        EVENT_ID_2,
        EVENT_ID_3,
      ]);
    });

    it("returns an empty array when an authenticated user has no RSVP records", async () => {
      authenticateAs();

      getUserAttendanceRecordsInDb.mockResolvedValue([]);

      await expect(service.rsvps.getRsvpdEvents(USER_ID)).resolves.toEqual([]);

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
      expect(getGroupsInDb).not.toHaveBeenCalled();
      expect(getUserAttendanceRecordsInDb).toHaveBeenCalledWith(USER_ID);
      expect(getFlattenedEventsByIdsInDb).not.toHaveBeenCalled();
    });

    it("returns an empty array when an authenticated user only has not_going records", async () => {
      authenticateAs();

      getGroupsInDb.mockResolvedValue(groups);

      getUserAttendanceRecordsInDb.mockResolvedValue([
        makeAttendanceUpdate(
          { event_id: EVENT_ID_1, user_id: USER_ID },
          "not_going",
        ),
        makeAttendanceUpdate(
          { event_id: EVENT_ID_2, user_id: USER_ID },
          "not_going",
        ),
        makeAttendanceUpdate(
          { event_id: EVENT_ID_3, user_id: USER_ID },
          "not_going",
        ),
      ]);

      getFlattenedEventsByIdsInDb.mockResolvedValueOnce(events);

      await expect(service.rsvps.getRsvpdEvents(USER_ID)).resolves.toEqual([]);

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
      expect(getGroupsInDb).not.toHaveBeenCalled();
      expect(getUserAttendanceRecordsInDb).toHaveBeenCalledWith(USER_ID);
      expect(getFlattenedEventsByIdsInDb).toHaveBeenCalledTimes(1);
      expect(getFlattenedEventsByIdsInDb).toHaveBeenCalledWith([
        EVENT_ID_1,
        EVENT_ID_2,
        EVENT_ID_3,
      ]);
    });
  });
});
