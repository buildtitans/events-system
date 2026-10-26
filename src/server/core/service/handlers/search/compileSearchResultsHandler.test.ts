import { SearchResultsCompiler } from "./compileSearchResultsHandler";
import {
  makeEventResult,
  makeGroupResult,
  makeEventSuggestion,
  makeGroupSuggestion,
} from "@/src/test/fixtures/search";

describe("SearchResultsCompiler", () => {
  const compiler = new SearchResultsCompiler();
  it("preserves enriched suggestions in event-first order", () => {
    const event = makeEventSuggestion(); const group = makeGroupSuggestion();
    expect(compiler.compileSuggestionOptions([event], [group])).toEqual([event, group]);
  });
  it("globally orders results by relevance, then kind", () => {
    const exactGroup = makeGroupResult("React"); const prefixGroup = makeGroupResult("React Developers"); const substringGroup = makeGroupResult("Learn React");
    const exactEvent = makeEventResult("REACT"); const prefixEvent = makeEventResult("React Night"); const substringEvent = makeEventResult("Using React");
    expect(compiler.compileSearchResults([substringEvent, prefixEvent, exactEvent], [substringGroup, prefixGroup, exactGroup], "react"))
      .toEqual([exactGroup, exactEvent, prefixGroup, prefixEvent, substringGroup, substringEvent]);
  });
  it("sorts equal-kind results alphabetically without modifying endpoint arrays", () => {
    const beta = makeEventResult("React Beta"); const alpha = makeEventResult("React Alpha"); const events = [beta, alpha];
    expect(compiler.compileSearchResults(events, [], "react")).toEqual([alpha, beta]);
    expect(events).toEqual([beta, alpha]);
  });
  it("supports empty results", () => {
    expect(compiler.compileSearchResults([], [], "react")).toEqual([]);
    expect(compiler.compileSuggestionOptions([], [])).toEqual([]);
  });
});
