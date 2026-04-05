import { ParticipationDtoHandler } from "@/src/server/core/service/handlers/participationDtoHandler";
import {
  dbMock,
  makeEvent,
  makeGroup,
  makeMembership,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("ParticipationDtoHandler.toRsvpShape", () => {
  let handler: ParticipationDtoHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    handler = new ParticipationDtoHandler(dbMock);
  });

  it("maps events, group lookup data, and attendance statuses into RSVP shapes", () => {
    const groupId1 = "5cf76d94-83c9-46de-90ac-fe4047a00000";
    const groupId2 = "6cf76d94-83c9-46de-90ac-fe4047a00000";
    const eventId1 = "7cf76d94-83c9-46de-90ac-fe4047a00000";
    const eventId2 = "8cf76d94-83c9-46de-90ac-fe4047a00000";

    const events = [
      makeEvent({
        id: eventId1,
        group_id: groupId1,
        title: "Board Game Night",
        meeting_location: "Downtown Cafe",
      }),
      makeEvent({
        id: eventId2,
        group_id: groupId2,
        title: "Frontend Study Session",
        meeting_location: "Online",
      }),
    ];

    const groupNameHash = {
      [groupId1]: {
        name: "Board Gamers",
        slug: "board-gamers",
      },
      [groupId2]: {
        name: "Frontend Crew",
        slug: "frontend-crew",
      },
    };

    const statusLookup = {
      [eventId1]: "going" as const,
      [eventId2]: "interested" as const,
    };

    expect(handler.toRsvpShape(events, groupNameHash, statusLookup)).toEqual([
      {
        event_id: eventId1,
        group_id: groupId1,
        group_name: "Board Gamers",
        starts_at: events[0].starts_at,
        starts_at_ms: events[0].starts_at_ms,
        scheduled_status: events[0].status,
        location: "Downtown Cafe",
        attendance_status: "going",
        event_title: "Board Game Night",
        group_slug: "board-gamers",
      },
      {
        event_id: eventId2,
        group_id: groupId2,
        group_name: "Frontend Crew",
        starts_at: events[1].starts_at,
        starts_at_ms: events[1].starts_at_ms,
        scheduled_status: events[1].status,
        location: "Online",
        attendance_status: "interested",
        event_title: "Frontend Study Session",
        group_slug: "frontend-crew",
      },
    ]);
  });
});

describe("ParticipationDtoHandler.toUserMembershipShape", () => {
  const getMemberCountsByGroupIdsInDb = dbMock.groupMembers
    .getMemberCountsByGroupIds as jest.Mock;

  let handler: ParticipationDtoHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    handler = new ParticipationDtoHandler(dbMock);
  });

  it("maps memberships with group details and member counts", async () => {
    const groupId1 = "5cf76d94-83c9-46de-90ac-fe4047a00000";
    const groupId2 = "6cf76d94-83c9-46de-90ac-fe4047a00000";

    const rawMemberships = [
      makeMembership({ user_id: "user-1", group_id: groupId1, role: "member" }),
      makeMembership({
        user_id: "user-1",
        group_id: groupId2,
        role: "organizer",
      }),
    ];

    const rawGroups = [
      makeGroup({
        id: groupId1,
        name: "Board Gamers",
        slug: "board-gamers",
        description: "Games every Friday night",
        location: "Bloomington, IL",
      }),
      makeGroup({
        id: groupId2,
        name: "Frontend Crew",
        slug: "frontend-crew",
        description: "Weekly frontend practice",
        location: "Online",
      }),
    ];

    const lookupMap = {
      [groupId1]: {
        name: "Board Gamers",
        slug: "board-gamers",
        group_description: "Games every Friday night",
      },
      [groupId2]: {
        name: "Frontend Crew",
        slug: "frontend-crew",
        group_description: "Weekly frontend practice",
      },
    };

    getMemberCountsByGroupIdsInDb.mockResolvedValue({
      [groupId1]: 4,
      [groupId2]: 9,
    });

    await expect(
      handler.toUserMembershipShape(rawMemberships, rawGroups, lookupMap),
    ).resolves.toEqual([
      {
        group_id: groupId1,
        group_name: "Board Gamers",
        group_description: "Games every Friday night",
        location: "Bloomington, IL",
        member_count: 4,
        group_slug: "board-gamers",
        roleInGroup: "member",
      },
      {
        group_id: groupId2,
        group_name: "Frontend Crew",
        group_description: "Weekly frontend practice",
        location: "Online",
        member_count: 9,
        group_slug: "frontend-crew",
        roleInGroup: "organizer",
      },
    ]);

    expect(getMemberCountsByGroupIdsInDb).toHaveBeenCalledWith([
      groupId1,
      groupId2,
    ]);
  });

  it("falls back to empty strings and zero when group data is missing", async () => {
    const missingGroupId = "5cf76d94-83c9-46de-90ac-fe4047a00000";

    const rawMemberships = [
      makeMembership({
        user_id: "user-1",
        group_id: missingGroupId,
        role: "member",
      }),
    ];

    getMemberCountsByGroupIdsInDb.mockResolvedValue({});

    await expect(
      handler.toUserMembershipShape(rawMemberships, [], {}),
    ).resolves.toEqual([
      {
        group_id: missingGroupId,
        group_name: "",
        group_description: "",
        location: "",
        member_count: 0,
        group_slug: "",
        roleInGroup: "member",
      },
    ]);

    expect(getMemberCountsByGroupIdsInDb).toHaveBeenCalledWith([
      missingGroupId,
    ]);
  });
});
