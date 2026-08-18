import { SearchResultsCompiler } from "@/src/lib/store/services/search/compileSearchResultsHandler";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

describe("SearchResultsCompiler", () => {
  const compiler = new SearchResultsCompiler();

  describe("compileSuggestionOptions", () => {
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
        {
          id: "group-2",
          slug: "react-group",
          name: "React Group",
        } as GroupSchemaType,
      ];

      expect(
        compiler.compileSuggestionOptions(events, groups, storedGroups),
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
      expect(compiler.compileSuggestionOptions([], [], [])).toEqual([]);
    });
  });

  describe("compileSearchResults", () => {
    it("preserves full schemas and globally orders results by relevance", () => {
      const exactGroup = {
        id: "group-exact",
        name: "React",
      } as GroupSchemaType;
      const prefixGroup = {
        id: "group-prefix",
        name: "React Developers",
      } as GroupSchemaType;
      const substringGroup = {
        id: "group-substring",
        name: "Learn React",
      } as GroupSchemaType;
      const exactEvent = {
        id: "event-exact",
        title: "REACT",
      } as EventSchemaType;
      const prefixEvent = {
        id: "event-prefix",
        title: "React Night",
      } as EventSchemaType;
      const substringEvent = {
        id: "event-substring",
        title: "Using React",
      } as EventSchemaType;

      expect(
        compiler.compileSearchResults(
          [substringEvent, prefixEvent, exactEvent],
          [substringGroup, prefixGroup, exactGroup],
          "react",
        ),
      ).toEqual([
        { kind: "group", data: exactGroup },
        { kind: "event", data: exactEvent },
        { kind: "group", data: prefixGroup },
        { kind: "event", data: prefixEvent },
        { kind: "group", data: substringGroup },
        { kind: "event", data: substringEvent },
      ]);
    });

    it("orders equal-kind results alphabetically when relevance ties", () => {
      const beta = { id: "event-beta", title: "React Beta" } as EventSchemaType;
      const alpha = {
        id: "event-alpha",
        title: "React Alpha",
      } as EventSchemaType;

      expect(
        compiler.compileSearchResults([beta, alpha], [], "react"),
      ).toEqual([
        { kind: "event", data: alpha },
        { kind: "event", data: beta },
      ]);
    });

    it("returns no search results for empty inputs", () => {
      expect(compiler.compileSearchResults([], [], "react")).toEqual([]);
    });
  });
});
