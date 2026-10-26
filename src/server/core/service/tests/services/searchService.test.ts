import { SearchService } from "../../services/searchService";
import { createMockDb } from "../mockers/mocks";
import {
  makeEventResult,
  makeGroupResult,
  makeEventSuggestion,
  makeGroupSuggestion,
} from "@/src/test/fixtures/search";

function setup() {
  const db = createMockDb();
  const searchEvents = jest.mocked(db.events.select.query.search).mockResolvedValue([]);
  const searchGroups = jest.mocked(db.groups.select.query.search).mockResolvedValue([]);
  const suggestEvents = jest.mocked(db.events.select.query.suggest).mockResolvedValue([]);
  const suggestGroups = jest.mocked(db.groups.select.query.suggestByName).mockResolvedValue([]);
  return { service: new SearchService(db), searchEvents, searchGroups, suggestEvents, suggestGroups };
}

describe("SearchService", () => {
  it("uses the normalized query for both database matching and global ranking", async () => {
    const { service, searchEvents, searchGroups } = setup();
    const exact = makeGroupResult("React");
    const substring = makeGroupResult("A React Community");
    const event = makeEventResult("React Night");
    searchEvents.mockResolvedValue([event]);
    searchGroups.mockResolvedValue([substring, exact]);

    await expect(service.search(" React ")).resolves.toEqual([exact, event, substring]);
    expect(searchEvents).toHaveBeenCalledWith("React");
    expect(searchGroups).toHaveBeenCalledWith("React");
  });

  it("combines enriched suggestions with events first", async () => {
    const { service, suggestEvents, suggestGroups } = setup();
    const event = makeEventSuggestion();
    const group = makeGroupSuggestion();
    suggestEvents.mockResolvedValue([event]);
    suggestGroups.mockResolvedValue([group]);

    await expect(service.suggestions(" react ")).resolves.toEqual([event, group]);
    expect(suggestEvents).toHaveBeenCalledWith("react");
    expect(suggestGroups).toHaveBeenCalledWith("react");
  });

  it.each(["search", "suggestions"] as const)("returns an empty %s response when neither repository finds matches", async method => {
    await expect(setup().service[method]("react")).resolves.toEqual([]);
  });

  it.each(["search", "suggestions"] as const)("rejects blank %s input before reading either repository", async method => {
    const { service, searchEvents, searchGroups, suggestEvents, suggestGroups } = setup();
    await expect(service[method]("   ")).rejects.toThrow("Invalid Schema");
    for (const read of [searchEvents, searchGroups, suggestEvents, suggestGroups]) {
      expect(read).not.toHaveBeenCalled();
    }
  });

  it.each([
    ["search", "searchEvents"],
    ["search", "searchGroups"],
    ["suggestions", "suggestEvents"],
    ["suggestions", "suggestGroups"],
  ] as const)("propagates %s failures from %s", async (method, failingRead) => {
    const context = setup();
    const error = new Error("Repository unavailable");
    context[failingRead].mockRejectedValue(error);
    await expect(context.service[method]("react")).rejects.toBe(error);
  });
});
