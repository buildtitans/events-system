import type { GroupDiscoverySummarySchemaType } from "@/src/schemas/groups/groupSchema";
import { CensusHandler } from "@/src/server/core/service/handlers/participations/censusHandler";
import {
  createMockDb,

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
    const groups: GroupDiscoverySummarySchemaType[] = [{
      group: { id: "group-1", name: "Group", slug: "group", description: null, location: null },
      meta: { kind: "no_next_event", category_name: "Technology", member_count: 0 },
    }];
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