import { CensusHandler } from "@/src/server/core/service/handlers/participations/censusHandler";
import {
  createMockDb,
  makeGroup,
} from "../mockers/mocks";

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