jest.mock("../events/thunks", () => {
  const { createAsyncThunk } = jest.requireActual("@reduxjs/toolkit") as typeof import("@reduxjs/toolkit");
  return { updateEventStatus: createAsyncThunk("EventSlice/updateEventStatus", async () => undefined) };
});
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
import type { GroupRefreshSchemaType } from "@/src/schemas/groups/groupSchema";
import openedGroupReducer, { clearOpenedGroupSlice, getCurrentRole } from "./OpenedGroupSlice";
import { hydrateGroup, refreshGroupEvents, scheduleNewEvent } from "./thunks";
import { updateEventStatus } from "../events/thunks";

function hydrate(events: Partial<GroupRefreshSchemaType> = {}) {
  const payload = makeHydratedGroup(events, { viewer_role: "organizer" });
  return openedGroupReducer(undefined, hydrateGroup.fulfilled(payload, "hydrate", payload.group.slug));
}

function makeLayout(): GroupRefreshSchemaType["group_events"] {
  return [[{
    kind: "card", variant: { type: "hero", size: { xs: 12, md: 6 } },
    event: { for: "withinGroup", content: makeNextEvent() },
  }]];
}

const emptyContent = {
  scheduled: { status: "n/a" },
  calandar: { status: "n/a" },
  next_event: { status: "n/a" },
};

describe("OpenedGroupSlice separated state", () => {
  it("stores group details and viewer metadata without event data", () => {
    const payload = makeHydratedGroup({}, { viewer_role: "organizer" });
    const { events, ...meta } = payload.meta;
    const state = hydrate();
    expect(state.group).toEqual({ status: "ready", data: { group: payload.group, meta } });
    expect(state.group).not.toHaveProperty("data.meta.events");
    expect(state.events).toEqual({ status: "ready", data: emptyContent });
    expect(events.group_events).toEqual([]);
  });

  it("updates viewer role without changing event content", () => {
    const initial = hydrate({ calandar: [makeTimelineItem()] });
    const joined = openedGroupReducer(initial, getCurrentRole("member"));
    const anonymous = openedGroupReducer(joined, getCurrentRole("anonymous"));
    expect(joined.group).toMatchObject({ data: { meta: { viewer_role: "member" } } });
    expect(anonymous.group).toMatchObject({ data: { meta: { viewer_role: "anonymous" } } });
    expect(anonymous.events).toEqual(initial.events);
  });

  it("resets both state branches when hydrating another group or closing", () => {
    const initial = hydrate({ next_event: makeNextEvent() });
    const pending = openedGroupReducer(initial, hydrateGroup.pending("hydrate-2", "other-group"));
    expect(pending.group).toEqual({ status: "pending" });
    expect(pending.events).toEqual({ status: "pending" });
    const failed = openedGroupReducer(pending, hydrateGroup.rejected(new Error("offline"), "hydrate-2", "other-group"));
    expect(failed.group.status).toBe("failed");
    expect(failed.events.status).toBe("failed");
    const closed = openedGroupReducer(initial, clearOpenedGroupSlice());
    expect(closed.group).toEqual({ status: "initial" });
    expect(closed.events).toEqual({ status: "initial" });
  });

  it.each([false, true])("maps each content branch independently during hydration and refresh (scheduled: %s)", hasScheduled => {
    const group_events = hasScheduled ? makeLayout() : [];
    const calandar = [makeTimelineItem({ timeline_status: "past", meta: { number_attendend: 4 } })];
    const next_event = hasScheduled ? makeNextEvent() : undefined;
    const response: GroupRefreshSchemaType = { group_events, calandar, next_event };
    const expected = {
      status: "ready",
      data: {
        scheduled: hasScheduled ? { status: "ready", data: group_events } : { status: "n/a" },
        calandar: { status: "ready", data: calandar },
        next_event: next_event ? { status: "ready", data: next_event } : { status: "n/a" },
      },
    };
    const hydrated = hydrate(response);
    expect(hydrated.events).toEqual(expected);
    const initial = hydrate();
    const pending = openedGroupReducer(initial, refreshGroupEvents.pending("refresh", "group-1"));
    expect(pending.events).toEqual({ status: "refreshing" });
    expect(pending.group).toEqual(initial.group);
    const refreshed = openedGroupReducer(pending, refreshGroupEvents.fulfilled(response, "refresh", "group-1"));
    expect(refreshed.events).toEqual(expected);
    expect(refreshed.group).toEqual(initial.group);
  });

  it("clears all previous event content on an empty successful refresh", () => {
    const initial = hydrate({ group_events: makeLayout(), calandar: [makeTimelineItem()], next_event: makeNextEvent() });
    const response: GroupRefreshSchemaType = { group_events: [], calandar: [] };
    const state = openedGroupReducer(initial, refreshGroupEvents.fulfilled(response, "refresh", "group-1"));
    expect(state.events).toEqual({ status: "ready", data: emptyContent });
    expect(state.group).toEqual(initial.group);
  });

  it.each([makeNextEvent(), undefined])("replaces or clears the previous next event on refresh (%#)", next_event => {
    const previous = makeNextEvent();
    previous.event.id = "previous-event";
    const initial = hydrate({ next_event: previous });
    const response: GroupRefreshSchemaType = { group_events: [], calandar: [], next_event };
    const state = openedGroupReducer(initial, refreshGroupEvents.fulfilled(response, "refresh", "group-1"));
    expect(state.events).toMatchObject({ status: "ready", data: {
      next_event: next_event ? { status: "ready", data: next_event } : { status: "n/a" },
    } });
    expect(state.group).toEqual(initial.group);
  });

  it("reports refresh failure without discarding group details", () => {
    const initial = hydrate();
    const state = openedGroupReducer(initial, refreshGroupEvents.rejected(new Error("offline"), "refresh", "group-1"));
    expect(state.events.status).toBe("failed");
    expect(state.group).toEqual(initial.group);
  });

  it("ignores refresh completion after closing the group", () => {
    const closed = openedGroupReducer(hydrate(), clearOpenedGroupSlice());
    const response: GroupRefreshSchemaType = { group_events: [], calandar: [] };
    expect(openedGroupReducer(closed, refreshGroupEvents.fulfilled(response, "refresh", "group-1"))).toEqual(closed);
  });

  it.each([
    makeTimelineItem({ timeline_status: "upcoming" }),
    makeTimelineItem({ timeline_status: "past", meta: { number_attendend: 4 } }),
    makeTimelineItem({ timeline_status: "today", event_phase: "upcoming" }),
    makeTimelineItem({ timeline_status: "today", event_phase: "ongoing" }),
    makeTimelineItem({ timeline_status: "today", event_phase: "completed" }),
  ])("preserves calendar metadata through hydration and refresh (%#)", item => {
    const initial = hydrate({ calandar: [item] });
    const response: GroupRefreshSchemaType = { group_events: [], calandar: [item] };
    const refreshed = openedGroupReducer(initial, refreshGroupEvents.fulfilled(response, "refresh", "group-1"));
    for (const state of [initial, refreshed]) {
      expect(state.events).toMatchObject({ status: "ready", data: {
        scheduled: { status: "n/a" }, calandar: { status: "ready", data: [item] },
      } });
    }
  });

  it("marks events refreshing after scheduling or changing event status", () => {
    const initial = hydrate();
    const scheduled = openedGroupReducer(initial, scheduleNewEvent.fulfilled({
      ...makeNextEvent().event,
      created_at: "2029-12-01T12:00:00Z",
      updated_at: null,
    }, "schedule", {
      group_id: "group-1", title: "Meetup", description: "Meetup", starts_at: "2030-01-01T18:00:00Z", meeting_location: "Library", img: null, tag: null,
    }));
    const updated = openedGroupReducer(initial, updateEventStatus.fulfilled(undefined, "update", {
      group_id: "group-1", event_id: "event-1", status: "cancelled",
    }));
    for (const state of [scheduled, updated]) {
      expect(state.events).toEqual({ status: "refreshing" });
      expect(state.group).toEqual(initial.group);
    }
  });
});
