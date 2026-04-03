import { ParticipationsService } from "@/src/server/core/service/services/participationsService";
import { dbMock, policyMock } from "./modules/mocks";
import {
  EventAttendantStatusSchemaType,
  EventAttendantsSchemaType,
} from "@/src/schemas/events/eventAttendantsSchema";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import { makeEvent } from "./eventService.test";
import { makeGroup } from "./groupService.test";
import type { NameSlugDescriptionLookup } from "../../lib/utils/buildGroupNameLookup";
import { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";

function makeAttendanceUpdate(
  overrides: Partial<EventAttendantsSchemaType> = {},
  newStatus?: EventAttendantsSchemaType["status"],
): EventAttendantsSchemaType {
  return {
    event_id: "event-1",
    user_id: "user-1",
    created_at: "2026-04-01T19:57:58.721Z",
    updated_at: "2026-04-01T19:57:58.721Z",
    status: newStatus ?? "interested",
    ...overrides,
  };
}

describe("ParticipationsService.updateRsvpStatus", () => {
  const updateAttendanceStatusInDb = dbMock.eventAttendants
    .updateAttendanceStatus as jest.Mock;

  let service: ParticipationsService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new ParticipationsService(dbMock, policyMock);
  });

  const newStatus: EventAttendantStatusSchemaType = "going";
  const event_id = "event-1";
  const user_id = "user-1";

  it("throws a 401 error when the user is not authenticated", async () => {
    (policyMock.requireAuthenticated as jest.Mock).mockImplementation(() => {
      throw new Error("401");
    });

    await expect(
      service.updateRsvpStatus(null, event_id, newStatus),
    ).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(updateAttendanceStatusInDb).not.toHaveBeenCalled();
  });

  it("updates the attendance status when the user is authenticated", async () => {
    (policyMock.requireAuthenticated as jest.Mock).mockReturnValue("user-1");

    updateAttendanceStatusInDb.mockResolvedValue(
      makeAttendanceUpdate({ user_id, event_id }, newStatus),
    );

    await expect(
      service.updateRsvpStatus("user-1", event_id, newStatus),
    ).resolves.toMatchObject(
      makeAttendanceUpdate({ user_id, event_id }, newStatus),
    );

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(updateAttendanceStatusInDb).toHaveBeenCalledWith(
      { event_id: "event-1", user_id: "user-1" },
      newStatus,
    );
  });
});

describe("ParticipationService.getUserRsvpToEvent", () => {
  const getUserRsvpStatusToEventInDb = dbMock.eventAttendants
    .getUserRsvpStatusToEvent as jest.Mock;

  let service: ParticipationsService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new ParticipationsService(dbMock, policyMock);
  });

  it("throws a 401 error when the user is not authenticated", async () => {
    (policyMock.requireAuthenticated as jest.Mock).mockImplementation(() => {
      throw new Error("401");
    });

    await expect(
      service.getUserRsvpToEvent("user-1", "event-1"),
    ).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(getUserRsvpStatusToEventInDb).not.toHaveBeenCalled();
  });

  it("gets the RSVP status of an authenticated user", async () => {
    (policyMock.requireAuthenticated as jest.Mock).mockReturnValue("user-1");

    getUserRsvpStatusToEventInDb.mockResolvedValue("going");

    await expect(
      service.getUserRsvpToEvent("user-1", "event-1"),
    ).resolves.toEqual("going");

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(getUserRsvpStatusToEventInDb).toHaveBeenCalledWith(
      "user-1",
      "event-1",
    );
  });
});

describe("ParticipationService.getAttendanceDictionary", () => {
  const getUserAttendanceRecordsInDb = dbMock.eventAttendants
    .getUserAttendanceRecords as jest.Mock;

  const getEvents = dbMock.events.getEvents as jest.Mock;

  let service: ParticipationsService;

  const records = [
    makeAttendanceUpdate({ event_id: "event-1" }, "going"),
    makeAttendanceUpdate({ event_id: "event-2" }, "interested"),
    makeAttendanceUpdate({ event_id: "event-3" }, "not_going"),
  ];

  beforeEach(() => {
    (jest.resetAllMocks(),
      (service = new ParticipationsService(dbMock, policyMock)));
  });

  it("Returns an attendance dictionary lookup for an authenticated user", async () => {
    (policyMock.requireAuthenticated as jest.Mock).mockReturnValue("user-1");

    getEvents.mockResolvedValue([
      makeEvent({ id: "event-1" }),
      makeEvent({ id: "event-2" }),
      makeEvent({ id: "event-3" }),
    ]);

    getUserAttendanceRecordsInDb.mockResolvedValue(records);

    await expect(
      service.getAttendanceDictionary("user-1"),
    ).resolves.toMatchObject({
      "event-1": "going",
      "event-2": "interested",
      "event-3": "not_going",
    });

    expect(getUserAttendanceRecordsInDb).toHaveBeenCalledWith("user-1");
  });
});

function makeMembership(
  overrides: Partial<GroupMemberSchemaType>,
): GroupMemberSchemaType {
  return {
    user_id: "user-1",
    group_id: "group-1",
    role: "member",
    joined_at: "2026-04-01T19:57:58.721Z",
    ...overrides,
  };
}

function makeDtoMembership(
  overrides: Partial<UserMembershipSchemaType>,
): UserMembershipSchemaType {
  return {
    group_id: "group-1",
    group_description: "group description",
    group_name: "group name",
    location: "online",
    member_count: 3,
    group_slug: "some-group-slug",
    roleInGroup: "member",
    ...overrides,
  };
}

describe("ParticipationService.getMemberships", () => {
  const getGroupsInDb = dbMock.groups.getGroups as jest.Mock;
  const getViewerMembershipsInDb = dbMock.groupMembers
    .getViewerMemberships as jest.Mock;

  const getMemberCountsByGroupIdsInDb = dbMock.groupMembers
    .getMemberCountsByGroupIds as jest.Mock;

  let service: ParticipationsService;

  const groupId1 = "5cf76d94-83c9-46de-90ac-fe4047a00000";
  const groupId2 = "6cf76d94-83c9-46de-90ac-fe4047a00000";
  const groupId3 = "7cf76d94-83c9-46de-90ac-fe4047a00000";

  const groups = [
    makeGroup({ id: groupId1, name: "new group 1" }),
    makeGroup({ id: groupId2, name: "new group 2" }),
    makeGroup({ id: groupId3, name: "new group 3" }),
  ];

  const dtoMemberships: UserMembershipSchemaType[] = [
    makeDtoMembership({
      group_id: groupId1,
      group_name: groups[0].name,
      group_description: groups[0].description ?? "",
      location: groups[0].location ?? "",
      group_slug: groups[0].slug,
      member_count: 3,
    }),
    makeDtoMembership({
      group_id: groupId2,
      group_name: groups[1].name,
      group_description: groups[1].description ?? "",
      location: groups[1].location ?? "",
      group_slug: groups[1].slug,
      member_count: 5,
    }),
    makeDtoMembership({
      group_id: groupId3,
      group_name: groups[2].name,
      group_description: groups[2].description ?? "",
      location: groups[2].location ?? "",
      group_slug: groups[2].slug,
      member_count: 7,
    }),
  ];

  beforeEach(() => {
    (jest.resetAllMocks(),
      (service = new ParticipationsService(dbMock, policyMock)));
  });

  it("Throws a 401 status for user that is not authenticated", async () => {
    (policyMock.requireAuthenticated as jest.Mock).mockImplementation(() => {
      throw new Error("401");
    });

    await expect(service.getMemberships(undefined)).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(getGroupsInDb).not.toHaveBeenCalled();
    expect(getViewerMembershipsInDb).not.toHaveBeenCalled();
  });

  it("Returns an array of memberships associated with the user for an authenticated user", async () => {
    (policyMock.requireAuthenticated as jest.Mock).mockReturnValue("user-1");

    getGroupsInDb.mockResolvedValue(groups);

    getViewerMembershipsInDb.mockResolvedValue([
      makeMembership({ user_id: "user-1", group_id: groupId1 }),
      makeMembership({ user_id: "user-1", group_id: groupId2 }),
      makeMembership({ user_id: "user-1", group_id: groupId3 }),
    ]);

    getMemberCountsByGroupIdsInDb.mockResolvedValue({
      [groupId1]: 3,
      [groupId2]: 5,
      [groupId3]: 7,
    });

    await expect(service.getMemberships("user-1")).resolves.toEqual(
      dtoMemberships,
    );

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(getViewerMembershipsInDb).toHaveBeenCalledWith("user-1");
  });
});

function makeRsvp(overrides: Partial<RsvpSchemaType>): RsvpSchemaType {
  return {
    group_id: "5cf76d94-83c9-46de-90ac-fe4047a00000",
    group_name: "new group",
    location: "Online",
    group_slug: "new-group-slug-name",
    attendance_status: "going",
    event_id: "event-1",
    event_title: "Design Trends Worth Paying Attention To in 2026",
    starts_at: "2026-04-15T17:30:00.000Z",
    starts_at_ms: new Date("2026-04-15T17:30:00.000Z").getTime(),
    scheduled_status: "scheduled",
    ...overrides,
  };
}

describe("ParticipationService.getRsvpdEvents", () => {
  const getGroupsInDb = dbMock.groups.getGroups as jest.Mock;
  const getUserAttendanceRecordsInDb = dbMock.eventAttendants
    .getUserAttendanceRecords as jest.Mock;
  const getFlattenedEventsByIdsInDb = dbMock.events
    .getFlattenedEventsByIds as jest.Mock;

  const groupId1 = "5cf76d94-83c9-46de-90ac-fe4047a00000";
  const groupId2 = "6cf76d94-83c9-46de-90ac-fe4047a00000";
  const groupId3 = "7cf76d94-83c9-46de-90ac-fe4047a00000";

  const eventId1 = "5cf76d94-83c9-46de-90ac-fe4047a00000";
  const eventId2 = "6cf76d94-83c9-46de-90ac-fe4047a00000";
  const eventId3 = "7cf76d94-83c9-46de-90ac-fe4047a00000";

  let service: ParticipationsService;

  const groups = [
    makeGroup({ id: groupId1, name: "new group 1" }),
    makeGroup({ id: groupId2, name: "new group 2" }),
    makeGroup({ id: groupId3, name: "new group 3" }),
  ];

  const events = [
    makeEvent({ id: eventId1, group_id: groupId1 }),
    makeEvent({ id: eventId2, group_id: groupId2 }),
    makeEvent({ id: eventId3, group_id: groupId3 }),
  ];

  const rsvps = [
    makeRsvp({
      event_id: eventId1,
      group_id: groupId1,
      attendance_status: "going",
      group_name: "new group 1",
    }),
    makeRsvp({
      event_id: eventId2,
      group_id: groupId2,
      attendance_status: "interested",
      group_name: "new group 2",
    }),
    makeRsvp({
      event_id: eventId3,
      group_id: groupId3,
      attendance_status: "going",
      group_name: "new group 3",
    }),
  ];

  beforeEach(() => {
    (jest.resetAllMocks(),
      (service = new ParticipationsService(dbMock, policyMock)));
  });

  it("Throws a 401 error when the user is not authenticated", async () => {
    (policyMock.requireAuthenticated as jest.Mock).mockImplementation(() => {
      throw new Error("401");
    });

    await expect(service.getRsvpdEvents(null)).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(getGroupsInDb).not.toHaveBeenCalled();
    expect(getUserAttendanceRecordsInDb).not.toHaveBeenCalled();
    expect(getFlattenedEventsByIdsInDb).not.toHaveBeenCalled();
  });

  it("Returns an array of the authenticated users RSVPs", async () => {
    (policyMock.requireAuthenticated as jest.Mock).mockReturnValue("user-1");

    getGroupsInDb.mockResolvedValue(groups);

    getUserAttendanceRecordsInDb.mockResolvedValue([
      makeAttendanceUpdate({ event_id: eventId1, user_id: "user-1" }, "going"),
      makeAttendanceUpdate(
        { event_id: eventId2, user_id: "user-1" },
        "interested",
      ),
      makeAttendanceUpdate({ event_id: eventId3, user_id: "user-1" }, "going"),
    ]);

    getFlattenedEventsByIdsInDb.mockResolvedValue(events);

    await expect(service.getRsvpdEvents("user-1")).resolves.toEqual(rsvps);

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(getGroupsInDb).toHaveBeenCalled();
    expect(getUserAttendanceRecordsInDb).toHaveBeenCalled();
    expect(getFlattenedEventsByIdsInDb).toHaveBeenCalled();
  });
});
