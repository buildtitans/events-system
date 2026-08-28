import { CensusHandler } from "@/src/server/core/service/handlers/participations/censusHandler";
import {
  createMockDb,
  makeAttendanceUpdate,
  makeGroup,
  makeMembership,
} from "../mockers/mocks";

describe("CensusHandler.getNumberOfAttendantsForEvent", () => {
  let handler: CensusHandler;
  let db: ReturnType<typeof createMockDb>;
  let getAttendantsInDb: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    getAttendantsInDb = db.eventAttendants.select.attendants as jest.Mock;
    handler = new CensusHandler(db);
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
  let handler: CensusHandler;
  let db: ReturnType<typeof createMockDb>;
  let getGroupMembersInDb: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    getGroupMembersInDb = db.groupMembers.select.allMembers as jest.Mock;
    handler = new CensusHandler(db);
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

describe("CensusHandler.getPopularGroups", () => {
  let db: ReturnType<typeof createMockDb>;
  let getAllMembershipRecordsInDb: jest.Mock;
  let getGroupsByIdsInDb: jest.Mock;
  let handler: CensusHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    getAllMembershipRecordsInDb = db.groupMembers.select.all as jest.Mock;
    getGroupsByIdsInDb = db.groups.select.byIds as jest.Mock;
    handler = new CensusHandler(db);
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
