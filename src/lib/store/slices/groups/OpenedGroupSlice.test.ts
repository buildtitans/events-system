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

import { makeHydratedGroup, makeNextEvent, makeTimelineItem } from "@/src/test/fixtures/groupHydration";
import openedGroupReducer, { clearOpenedGroupSlice, getCurrentRole } from "./OpenedGroupSlice";
import { hydrateGroup, refreshGroupEvents } from "./thunks";

describe("OpenedGroupSlice", () => {
  it("stores the viewer role with the hydrated group", () => {
    const payload = makeHydratedGroup({}, { viewer_role: "organizer" });
    const state = openedGroupReducer(undefined, hydrateGroup.fulfilled(
      payload, "hydrate-1", payload.group.slug,
    ));
    expect(state.group).toMatchObject({ data: { meta: { viewer_role: "organizer" } } });
    expect(state).not.toHaveProperty("viewerRole");
    expect(state.group).toEqual({ status: "ready", data: payload });
  });

  it("updates membership role and resets it without discarding the public group", () => {
    const payload = makeHydratedGroup();
    const initial = openedGroupReducer(undefined, hydrateGroup.fulfilled(
      payload, "hydrate-1", payload.group.slug,
    ));
    const joined = openedGroupReducer(initial, getCurrentRole("member"));
    const anonymous = openedGroupReducer(joined, getCurrentRole("anonymous"));
    expect(joined.group).toMatchObject({ data: { meta: { viewer_role: "member" } } });
    expect(anonymous.group).toMatchObject({ data: { meta: { viewer_role: "anonymous" } } });
    expect(anonymous.group).toEqual(initial.group);
  });

  it("clears the prior role when changing groups, failing hydration, or closing a group", () => {
    const payload = makeHydratedGroup({}, { viewer_role: "organizer" });
    const initial = openedGroupReducer(undefined, hydrateGroup.fulfilled(payload, "hydrate-1", payload.group.slug));
    const pending = openedGroupReducer(initial, hydrateGroup.pending("hydrate-2", "another-group"));
    const failed = openedGroupReducer(initial, hydrateGroup.rejected(
      new Error("network unavailable"), "hydrate-2", "another-group",
    ));
    expect(pending.group).toEqual({ status: "pending" });
    expect(failed.group.status).toBe("failed");
    expect(openedGroupReducer(initial, clearOpenedGroupSlice()).group).toEqual({ status: "initial" });
  });

  it("stores hydrated group metadata together", () => {
    const hydrated = makeHydratedGroup({ next_event: makeNextEvent() });
    const state = openedGroupReducer(undefined, hydrateGroup.fulfilled(
      hydrated, "request-1", hydrated.group.slug,
    ));
    expect(state.group).toEqual({ status: "ready", data: hydrated });
    expect(state.events.status).toBe("n/a");
    expect(state.calandar.status).toBe("n/a");
  });

  it("keeps a group ready when it has no upcoming event", () => {
    const payload = makeHydratedGroup();
    const state = openedGroupReducer(undefined, hydrateGroup.fulfilled(
      payload, "request-1", payload.group.slug,
    ));
    expect(state.group).toEqual({ status: "ready", data: payload });
    expect(payload.meta.events.next_event).toBeUndefined();
  });

  it("refreshes layout and calendar while retaining the opened group", () => {
    const payload = makeHydratedGroup();
    const initial = openedGroupReducer(undefined, hydrateGroup.fulfilled(
      payload, "hydrate-1", payload.group.slug,
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
    const payload = makeHydratedGroup();
    const initial = openedGroupReducer(undefined, hydrateGroup.fulfilled(
      payload, "hydrate-1", payload.group.slug,
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
      hydrated, "hydrate-1", hydrated.group.slug,
    ));

    const state = openedGroupReducer(initial, refreshGroupEvents.fulfilled({
      refreshedEventsLayout: [], calandar: [], nextEvent,
    }, "refresh-1", hydrated.group.id));

    expect(state.group).toEqual({
      status: "ready",
      data: { ...hydrated, meta: { ...hydrated.meta, events: { ...hydrated.meta.events, next_event: nextEvent, group_events: [], calandar: [] } } },
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
    const payload = makeHydratedGroup({ calandar: [item] });
    const initial = openedGroupReducer(undefined, hydrateGroup.fulfilled(
      payload, "hydrate-1", payload.group.slug,
    ));
    expect(initial.calandar).toEqual({ status: "ready", data: [item] });

    const refreshed = openedGroupReducer(initial, refreshGroupEvents.fulfilled({
      refreshedEventsLayout: [], calandar: [item], nextEvent: undefined,
    }, "refresh-1", payload.group.id));
    expect(refreshed.calandar).toEqual({ status: "ready", data: [item] });
  });
});
