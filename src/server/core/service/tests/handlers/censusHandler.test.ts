import { CensusHandler } from "@/src/server/core/service/handlers/participations/censusHandler";
import {
  createMockDb,
  makeGroup,
  makeMembership,
} from "../mockers/mocks";

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
  let handler: CensusHandler;
  let getPopularGroups: jest.MockedFunction<
    ReturnType<typeof createMockDb>["groups"]["select"]["popular"]
  >;

  beforeEach(() => {
    const db = createMockDb();
    getPopularGroups = jest.mocked(db.groups.select.popular);
    handler = new CensusHandler(db);
  });

  it("returns the groups selected as popular", async () => {
    const groups = [makeGroup({ id: "group-1" }), makeGroup({ id: "group-3" })];
    getPopularGroups.mockResolvedValue(groups);

    await expect(handler.getPopularGroups()).resolves.toEqual(groups);
    expect(getPopularGroups).toHaveBeenCalledWith();
  });

  it("returns an empty array when no groups qualify", async () => {
    getPopularGroups.mockResolvedValue([]);

    await expect(handler.getPopularGroups()).resolves.toEqual([]);
    expect(getPopularGroups).toHaveBeenCalledWith();
  });

  it("propagates a selector failure", async () => {
    getPopularGroups.mockRejectedValue(new Error("Database unavailable"));

    await expect(handler.getPopularGroups()).rejects.toThrow("Database unavailable");
  });
});