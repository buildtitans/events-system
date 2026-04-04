import { LayoutFormatter } from "@/src/server/core/service/services/layoutFormatter";
import {
  fullPage,
  multiplePages,
  sixEvents,
  sevenEvents,
} from "@/src/server/core/service/tests/services/layoutFormatter.fixtures";

describe("LayoutFormatter.compileLayout", () => {
  let formatter: LayoutFormatter;

  beforeEach(() => {
    formatter = new LayoutFormatter();
  });

  it("returns an empty layout when no events are provided", () => {
    expect(formatter.compileLayout([])).toEqual([]);
  });

  it("formats a full page of events into the expected card and stack slots", () => {
    expect(formatter.compileLayout(sixEvents)).toEqual(fullPage);
  });

  it("paginates events after six items and formats each page independently", () => {
    expect(formatter.compileLayout(sevenEvents)).toEqual(multiplePages);
  });
});
