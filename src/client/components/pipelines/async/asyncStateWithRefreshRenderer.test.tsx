import { renderToStaticMarkup } from "react-dom/server";
import type { AsyncStateWithRefresh } from "@/src/lib/types/state/types";
import type { GroupEventsState } from "@/src/lib/store/slices/groups/types";
import AsyncStateWithRefreshRenderer from "./asyncStateWithRefreshRenderer";

type Data = { item: { status: "ready"; data: string } | { status: "n/a" } };

function setup(state: AsyncStateWithRefresh<Data>) {
  const selectContent = jest.fn((data: Data) => data.item);
  const ready = jest.fn((data: string) => <span>{data}</span>);
  const empty = jest.fn(() => <span>No content</span>);
  return { state, selectContent, ready, empty };
}

describe("AsyncStateWithRefreshRenderer", () => {
  it("renders selected ready content", () => {
    const props = setup({ status: "ready", data: { item: { status: "ready", data: "Result" } } });
    expect(renderToStaticMarkup(<AsyncStateWithRefreshRenderer {...props} />)).toBe("<span>Result</span>");
    expect(props.ready).toHaveBeenCalledWith("Result");
    expect(props.empty).not.toHaveBeenCalled();
  });

  it("renders the selected content's empty fallback", () => {
    const props = setup({ status: "ready", data: { item: { status: "n/a" } } });
    expect(renderToStaticMarkup(<AsyncStateWithRefreshRenderer {...props} />)).toBe("<span>No content</span>");
    expect(props.ready).not.toHaveBeenCalled();
  });

  it.each(["pending", "refreshing"] as const)("uses the pending fallback during %s without selecting content", status => {
    const props = setup({ status });
    expect(renderToStaticMarkup(<AsyncStateWithRefreshRenderer {...props} pending={() => <span>Loading</span>} />)).toBe("<span>Loading</span>");
    expect(props.selectContent).not.toHaveBeenCalled();
  });

  it.each(["pending", "refreshing"] as const)("shows the default spinner during %s", status => {
    expect(renderToStaticMarkup(<AsyncStateWithRefreshRenderer {...setup({ status })} />)).toContain("MuiCircularProgress");
  });

  it("renders nothing initially unless a fallback is provided", () => {
    const props = setup({ status: "initial" });
    expect(renderToStaticMarkup(<AsyncStateWithRefreshRenderer {...props} />)).toBe("");
    expect(renderToStaticMarkup(<AsyncStateWithRefreshRenderer {...props} initial={() => <span>Initial</span>} />)).toBe("<span>Initial</span>");
    expect(props.selectContent).not.toHaveBeenCalled();
  });

  it("passes the error to the failure fallback without selecting content", () => {
    const props = setup({ status: "failed", error: "Request failed" });
    const failed = jest.fn((error: string) => <span>{error}</span>);
    expect(renderToStaticMarkup(<AsyncStateWithRefreshRenderer {...props} failed={failed} />)).toBe("<span>Request failed</span>");
    expect(failed).toHaveBeenCalledWith("Request failed");
    expect(props.selectContent).not.toHaveBeenCalled();
  });

  it("respects an explicitly empty pending fallback", () => {
    expect(renderToStaticMarkup(<AsyncStateWithRefreshRenderer {...setup({ status: "refreshing" })} pending={() => null} />)).toBe("");
  });

  it("infers scheduled content from the group event state", () => {
    const state: GroupEventsState = { status: "ready", data: {
      scheduled: { status: "ready", data: [] },
      calandar: { status: "n/a" }, next_event: { status: "n/a" },
    } };
    expect(renderToStaticMarkup(<AsyncStateWithRefreshRenderer
      state={state}
      selectContent={data => data.scheduled}
      ready={pages => <span>{pages.length} pages</span>}
      empty={() => <span>No scheduled events</span>}
    />)).toBe("<span>0 pages</span>");
  });
});
