import { CensusHandler } from "@/src/server/core/service/handlers/censusHandler";
import type { DBClient } from "@/src/server/core/db";
import {
  dbMock,
  makeAttendanceUpdate,
  makeEvent,
  makeGroup,
  makeMembership,
} from "../mockers/mocks";

function makePopularGroupsDbMock(): DBClient {
  return {
    ...dbMock,
    groups: {
      ...dbMock.groups,
      getGroupsByIds: jest.fn(),
    },
    groupMembers: {
      ...dbMock.groupMembers,
      getAllMembershipRecords: jest.fn(),
    },
  } as unknown as DBClient;
}

describe("CensusHandler.getNumberOfAttendantsForEvent", () => {
  const getAttendantsInDb = dbMock.eventAttendants.getAttendants as jest.Mock;

  let handler: CensusHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    handler = new CensusHandler(dbMock);
  });

  const attendants = [
    makeAttendanceUpdate({ event_id: "event-1" }, "going"),
    makeAttendanceUpdate({ event_id: "event-1" }, "going"),
    makeAttendanceUpdate({ event_id: "event-1" }, "interested"),
    makeAttendanceUpdate({ event_id: "event-1" }, "going"),
    makeAttendanceUpdate({ event_id: "event-1" }, "going"),
    makeAttendanceUpdate({ event_id: "event-1" }, "interested"),
    makeAttendanceUpdate({ event_id: "event-1" }, "interested"),
    makeAttendanceUpdate({ event_id: "event-1" }, "going"),
  ];

  const numberGoing = attendants.filter((att) => att.status === "going");
  const numberInterested = attendants.filter(
    (att) => att.status === "interested",
  );

  it("Returns the number of attending members, and interested members or the event", async () => {
    getAttendantsInDb.mockResolvedValue(attendants);

    await expect(
      handler.getNumberOfAttendantsForEvent("event-1"),
    ).resolves.toMatchObject({
      numGoing: numberGoing.length,
      numInterested: numberInterested.length,
    });
  });
});

describe("CensusHandler.getGroupHeadCount", () => {
  const getGroupMembersInDb = dbMock.groupMembers.getGroupMembers as jest.Mock;

  let handler: CensusHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    handler = new CensusHandler(dbMock);
  });

  it("returns the total number of group members", async () => {
    getGroupMembersInDb.mockResolvedValue([
      makeMembership({ user_id: "user-1", group_id: "group-1" }),
      makeMembership({ user_id: "user-2", group_id: "group-1" }),
      makeMembership({ user_id: "user-3", group_id: "group-1" }),
      makeMembership({ user_id: "user-4", group_id: "group-1" }),
    ]);

    await expect(handler.getGroupHeadCount("group-1")).resolves.toBe(4);

    expect(getGroupMembersInDb).toHaveBeenCalledWith("group-1");
  });
});

describe("CensusHandler.getPopularEventsIds", () => {
  const getAllAttendanceRecordsInDb = dbMock.eventAttendants
    .getAllAttendanceRecords as jest.Mock;
  const getEventsInDb = dbMock.events.getEvents as jest.Mock;

  let handler: CensusHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-06T00:00:00.000Z"));
    handler = new CensusHandler(dbMock);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns only active event ids that meet the popularity threshold", async () => {
    getEventsInDb.mockResolvedValue([
      makeEvent({
        id: "active-popular",
        starts_at: "2026-04-08T12:00:00.000Z",
        starts_at_ms: new Date("2026-04-08T12:00:00.000Z").getTime(),
      }),
      makeEvent({
        id: "active-not-popular",
        starts_at: "2026-04-09T12:00:00.000Z",
        starts_at_ms: new Date("2026-04-09T12:00:00.000Z").getTime(),
      }),
      makeEvent({
        id: "past-even-if-popular",
        starts_at: "2026-04-01T12:00:00.000Z",
        starts_at_ms: new Date("2026-04-01T12:00:00.000Z").getTime(),
      }),
    ]);

    getAllAttendanceRecordsInDb.mockResolvedValue([
      makeAttendanceUpdate(
        {
          event_id: "active-popular",
          user_id: "user-1",
        },
        "going",
      ),
      makeAttendanceUpdate(
        {
          event_id: "active-popular",
          user_id: "user-2",
        },
        "interested",
      ),
      makeAttendanceUpdate(
        {
          event_id: "active-popular",
          user_id: "user-3",
        },
        "going",
      ),
      makeAttendanceUpdate(
        {
          event_id: "active-popular",
          user_id: "user-4",
        },
        "interested",
      ),
      makeAttendanceUpdate(
        {
          event_id: "active-not-popular",
          user_id: "user-5",
        },
        "going",
      ),
      makeAttendanceUpdate(
        {
          event_id: "active-not-popular",
          user_id: "user-6",
        },
        "going",
      ),
      makeAttendanceUpdate(
        {
          event_id: "active-not-popular",
          user_id: "user-7",
        },
        "interested",
      ),
      makeAttendanceUpdate(
        {
          event_id: "past-even-if-popular",
          user_id: "user-8",
        },
        "going",
      ),
      makeAttendanceUpdate(
        {
          event_id: "past-even-if-popular",
          user_id: "user-9",
        },
        "going",
      ),
      makeAttendanceUpdate(
        {
          event_id: "past-even-if-popular",
          user_id: "user-10",
        },
        "interested",
      ),
      makeAttendanceUpdate(
        {
          event_id: "past-even-if-popular",
          user_id: "user-11",
        },
        "going",
      ),
    ]);

    await expect(handler.getPopularEventsIds()).resolves.toEqual([
      "active-popular",
    ]);

    expect(getAllAttendanceRecordsInDb).toHaveBeenCalled();
    expect(getEventsInDb).toHaveBeenCalled();
  });
});

describe("CensusHandler.getPopularGroups", () => {
  let testDbMock: DBClient;
  let getAllMembershipRecordsInDb: jest.Mock;
  let getGroupsByIdsInDb: jest.Mock;
  let handler: CensusHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    testDbMock = makePopularGroupsDbMock();
    getAllMembershipRecordsInDb = testDbMock.groupMembers
      .getAllMembershipRecords as jest.Mock;
    getGroupsByIdsInDb = testDbMock.groups.getGroupsByIds as jest.Mock;
    handler = new CensusHandler(testDbMock);
  });

  it("returns groups with at least two members", async () => {
    getAllMembershipRecordsInDb.mockResolvedValue([
      makeMembership({ user_id: "user-1", group_id: "group-1" }),
      makeMembership({ user_id: "user-2", group_id: "group-1" }),
      makeMembership({ user_id: "user-3", group_id: "group-2" }),
      makeMembership({ user_id: "user-4", group_id: "group-3" }),
      makeMembership({ user_id: "user-5", group_id: "group-3" }),
      makeMembership({ user_id: "user-6", group_id: "group-3" }),
    ]);

    const popularGroups = [
      makeGroup({ id: "group-1", name: "group 1" }),
      makeGroup({ id: "group-3", name: "group 3" }),
    ];

    getGroupsByIdsInDb.mockResolvedValue(popularGroups);

    await expect(handler.getPopularGroups()).resolves.toEqual(popularGroups);

    expect(getAllMembershipRecordsInDb).toHaveBeenCalled();
    expect(getGroupsByIdsInDb).toHaveBeenCalledWith(["group-1", "group-3"]);
  });

  it("returns an empty array when no groups meet the popularity threshold", async () => {
    getAllMembershipRecordsInDb.mockResolvedValue([
      makeMembership({ user_id: "user-1", group_id: "group-1" }),
      makeMembership({ user_id: "user-2", group_id: "group-2" }),
    ]);

    getGroupsByIdsInDb.mockResolvedValue([]);

    await expect(handler.getPopularGroups()).resolves.toEqual([]);

    expect(getAllMembershipRecordsInDb).toHaveBeenCalled();
    expect(getGroupsByIdsInDb).toHaveBeenCalledWith([]);
  });
});
