import { ParticipationsService } from "@/src/server/core/service/services/participationsService";
import {
  dbMock,
  policyMock,
  makeEvent,
  makeAttendanceUpdate,
  makeMembership,
  rsvps,
  groups,
  events,
  dtoMemberships,
  authenticateAs,
  unauthenticated,
} from "@/src/server/core/service/tests/mockers/mocks";
import {
  USER_ID,
  EVENT_ID,
  GROUP_ID_1,
  GROUP_ID_2,
  GROUP_ID_3,
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
  const getViewerMembershipsInDb = dbMock.groupMembers
    .getViewerMemberships as jest.Mock;
  const getMemberCountsByGroupIdsInDb = dbMock.groupMembers
    .getMemberCountsByGroupIds as jest.Mock;
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
        service.updateRsvpStatus(null, EVENT_ID, newStatus),
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
        service.updateRsvpStatus(USER_ID, EVENT_ID, newStatus),
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
        service.getUserRsvpToEvent(undefined, EVENT_ID),
      ).rejects.toThrow("401");

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(undefined);
      expect(getUserRsvpStatusToEventInDb).not.toHaveBeenCalled();
    });

    it("gets the RSVP status of an authenticated user", async () => {
      authenticateAs();

      getUserRsvpStatusToEventInDb.mockResolvedValue("going");

      await expect(
        service.getUserRsvpToEvent(USER_ID, EVENT_ID),
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
        service.getAttendanceDictionary(USER_ID),
      ).resolves.toMatchObject({
        [EVENT_ID_1]: "going",
        [EVENT_ID_2]: "interested",
        [EVENT_ID_3]: "not_going",
      });

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
      expect(getUserAttendanceRecordsInDb).toHaveBeenCalledWith(USER_ID);
    });
  });

  describe("getMemberships", () => {
    it("throws a 401 status for a user that is not authenticated", async () => {
      unauthenticated();

      await expect(service.getMemberships(undefined)).rejects.toThrow("401");

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(undefined);
      expect(getGroupsInDb).not.toHaveBeenCalled();
      expect(getViewerMembershipsInDb).not.toHaveBeenCalled();
    });

    it("returns memberships associated with the authenticated user", async () => {
      authenticateAs();

      getGroupsInDb.mockResolvedValue(groups);

      getViewerMembershipsInDb.mockResolvedValue([
        makeMembership({ user_id: USER_ID, group_id: GROUP_ID_1 }),
        makeMembership({ user_id: USER_ID, group_id: GROUP_ID_2 }),
        makeMembership({ user_id: USER_ID, group_id: GROUP_ID_3 }),
      ]);

      getMemberCountsByGroupIdsInDb.mockResolvedValue({
        [GROUP_ID_1]: 3,
        [GROUP_ID_2]: 5,
        [GROUP_ID_3]: 7,
      });

      await expect(service.getMemberships(USER_ID)).resolves.toEqual(
        dtoMemberships,
      );

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
      expect(getViewerMembershipsInDb).toHaveBeenCalledWith(USER_ID);
    });
  });

  describe("getRsvpdEvents", () => {
    it("throws a 401 error when the user is not authenticated", async () => {
      unauthenticated();

      await expect(service.getRsvpdEvents(null)).rejects.toThrow("401");

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

      getFlattenedEventsByIdsInDb.mockResolvedValue(events);

      await expect(service.getRsvpdEvents(USER_ID)).resolves.toEqual(rsvps);

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
      expect(getGroupsInDb).toHaveBeenCalled();
      expect(getUserAttendanceRecordsInDb).toHaveBeenCalled();
      expect(getFlattenedEventsByIdsInDb).toHaveBeenCalledWith([
        EVENT_ID_1,
        EVENT_ID_2,
        EVENT_ID_3,
      ]);
    });

    it("returns an empty array when an authenticated user has no RSVP records", async () => {
      authenticateAs();

      getGroupsInDb.mockResolvedValue(groups);
      getUserAttendanceRecordsInDb.mockResolvedValue([]);

      await expect(service.getRsvpdEvents(USER_ID)).resolves.toEqual([]);

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
      expect(getGroupsInDb).toHaveBeenCalled();
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

      await expect(service.getRsvpdEvents(USER_ID)).resolves.toEqual([]);

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
      expect(getGroupsInDb).toHaveBeenCalled();
      expect(getUserAttendanceRecordsInDb).toHaveBeenCalledWith(USER_ID);
      expect(getFlattenedEventsByIdsInDb).not.toHaveBeenCalled();
    });
  });
});
