import { SearchResultsCompiler } from "@/src/lib/store/services/search/compileSearchResultsHandler";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

describe("SearchResultsCompiler", () => {
  it("maps event and group results into event-first suggestions", () => {
    const storedGroups = [
      { id: "group-1", slug: "stored-group" } as GroupSchemaType,
    ];
    const events = [
      {
        id: "event-1",
        group_id: "group-1",
        title: "TypeScript Night",
      } as EventSchemaType,
    ];
    const groups = [
      { id: "group-2", slug: "react-group", name: "React Group" } as GroupSchemaType,
    ];

    expect(
      new SearchResultsCompiler().compileOptions(events, groups, storedGroups),
    ).toEqual([
      {
        kind: "event",
        label: "Event: \n TypeScript Night",
        event_id: "event-1",
        group_id: "group-1",
        slug: "stored-group",
      },
      {
        kind: "group",
        label: "Group: \n React Group",
        group_id: "group-2",
        slug: "react-group",
      },
    ]);
  });

  it("returns no suggestions for empty results", () => {
    expect(new SearchResultsCompiler().compileOptions([], [], [])).toEqual([]);
  });
});
