jest.mock("./thunks", () => {
  const { createAsyncThunk } = jest.requireActual(
    "@reduxjs/toolkit",
  ) as typeof import("@reduxjs/toolkit");

  return {
    hydrateGroup: createAsyncThunk("OpenedGroup/hydrate", async () => null),
    refreshGroupEvents: createAsyncThunk(
      "OpenedGroup/refresh-events",
      async () => null,
    ),
    refreshArchivedEvents: createAsyncThunk(
      "OpenedGroup/refresh-archives",
      async () => null,
    ),
    scheduleNewEvent: createAsyncThunk(
      "OpenGroup/scheduleNewEvent",
      async () => null,
    ),
  };
});

import { makeHydratedGroup, makeHydrationPayload, makeNextEvent, makeTimelineItem } from "../../services/hydration/groupHydration.fixtures";
import openedGroupReducer from "./OpenedGroupSlice";
import { hydrateGroup, refreshGroupEvents } from "./thunks";

describe("OpenedGroupSlice", () => {
  it("stores hydrated group metadata together", () => {
    const hydrated = makeHydratedGroup({ next_event: makeNextEvent() });
    const state = openedGroupReducer(undefined, hydrateGroup.fulfilled(
      makeHydrationPayload({ hydrated }), "request-1", hydrated.group.slug,
    ));
    expect(state.group).toEqual({ status: "ready", data: hydrated });
    expect(state.events.status).toBe("n/a");
    expect(state.calandar.status).toBe("n/a");
  });

  it("keeps a group ready when it has no upcoming event", () => {
    const payload = makeHydrationPayload();
    const state = openedGroupReducer(undefined, hydrateGroup.fulfilled(
      payload, "request-1", payload.hydrated.group.slug,
    ));
    expect(state.group).toEqual({ status: "ready", data: payload.hydrated });
    expect(payload.hydrated.meta.next_event).toBeUndefined();
  });

  it("refreshes layout and calendar while retaining the opened group", () => {
    const payload = makeHydrationPayload();
    const initial = openedGroupReducer(undefined, hydrateGroup.fulfilled(
      payload, "hydrate-1", payload.hydrated.group.slug,
    ));
    const pending = openedGroupReducer(initial, refreshGroupEvents.pending("refresh-1", "group-1"));
    expect(pending.events.status).toBe("refreshing");
    expect(pending.calandar.status).toBe("pending");
    expect(pending.group).toEqual(initial.group);
    const nextEvent = makeNextEvent();
    const timelineItem = makeTimelineItem();
    const state = openedGroupReducer(pending, refreshGroupEvents.fulfilled({
      refreshedEventsLayout: [], calandar: [timelineItem], nextEvent,
    }, "refresh-1", "group-1"));
    expect(state.calandar).toEqual({ status: "ready", data: [timelineItem] });
    expect(state.events.status).toBe("n/a");
  });

  it("settles an empty calendar refresh as unavailable", () => {
    const state = openedGroupReducer(undefined, refreshGroupEvents.fulfilled({
      refreshedEventsLayout: [], calandar: [], nextEvent: undefined,
    }, "refresh-1", "group-1"));
    expect(state.calandar.status).toBe("n/a");
    expect(state.events.status).toBe("n/a");
  });

  it("reports refresh failures without discarding the opened group", () => {
    const payload = makeHydrationPayload();
    const initial = openedGroupReducer(undefined, hydrateGroup.fulfilled(
      payload, "hydrate-1", payload.hydrated.group.slug,
    ));
    const state = openedGroupReducer(initial, refreshGroupEvents.rejected(
      new Error("network unavailable"), "refresh-1", "group-1",
    ));
    expect(state.events.status).toBe("failed");
    expect(state.calandar.status).toBe("failed");
    expect(state.group).toEqual(initial.group);
  });

  const previousEvent = makeNextEvent();
  const replacementEvent = makeNextEvent();
  replacementEvent.event.id = "event-2";
  const updatedEvent = makeNextEvent();
  updatedEvent.event.starts_at = "2026-08-20T18:00:00.000Z";
  updatedEvent.event.starts_at_ms = Date.parse(updatedEvent.event.starts_at);
  updatedEvent.meta.attendance = { going: 5, interested: 3 };

  it.each([
    { scenario: "assigns the first next event", previous: undefined, nextEvent: previousEvent },
    { scenario: "replaces the next event", previous: previousEvent, nextEvent: replacementEvent },
    { scenario: "updates details and attendance for the same event ID", previous: previousEvent, nextEvent: updatedEvent },
    { scenario: "clears the next event when none remains", previous: previousEvent, nextEvent: undefined },
  ])("$scenario after a refresh", ({ previous, nextEvent }) => {
    const hydrated = makeHydratedGroup({ next_event: previous });
    const initial = openedGroupReducer(undefined, hydrateGroup.fulfilled(
      makeHydrationPayload({ hydrated }), "hydrate-1", hydrated.group.slug,
    ));

    const state = openedGroupReducer(initial, refreshGroupEvents.fulfilled({
      refreshedEventsLayout: [], calandar: [], nextEvent,
    }, "refresh-1", hydrated.group.id));

    expect(state.group).toEqual({
      status: "ready",
      data: { ...hydrated, meta: { ...hydrated.meta, next_event: nextEvent } },
    });
  });
});

describe("OpenedGroupSlice timeline variants", () => {
  it.each([
    makeTimelineItem({ timeline_status: "upcoming" }),
    makeTimelineItem({ timeline_status: "past", meta: { number_attendend: 4 } }),
    makeTimelineItem({ timeline_status: "today", event_phase: "upcoming" }),
    makeTimelineItem({ timeline_status: "today", event_phase: "ongoing" }),
    makeTimelineItem({ timeline_status: "today", event_phase: "completed" }),
  ])("preserves timeline metadata through hydration and refresh (%#)", (item) => {
    const payload = makeHydrationPayload({ calandar: [item] });
    const initial = openedGroupReducer(undefined, hydrateGroup.fulfilled(
      payload, "hydrate-1", payload.hydrated.group.slug,
    ));
    expect(initial.calandar).toEqual({ status: "ready", data: [item] });

    const refreshed = openedGroupReducer(initial, refreshGroupEvents.fulfilled({
      refreshedEventsLayout: [], calandar: [item], nextEvent: undefined,
    }, "refresh-1", payload.hydrated.group.id));
    expect(refreshed.calandar).toEqual({ status: "ready", data: [item] });
  });
});
