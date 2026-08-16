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

import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { OpenedGroupPayload } from "../../services/types";
import openedGroupReducer from "./OpenedGroupSlice";
import { hydrateGroup, refreshGroupEvents } from "./thunks";

function makeEvent(): EventSchemaType {
  return {
    id: "event-1",
    group_id: "group-1",
    status: "scheduled",
    starts_at: "2026-08-19T18:00:00.000Z",
    starts_at_ms: Date.parse("2026-08-19T18:00:00.000Z"),
    img: "event.jpg",
    tag: "Type Safety",
    title: "Runtime Validation Meets Static Types",
    description: "An event about runtime validation.",
    meeting_location: "Online",
    created_at: "2026-08-01T12:00:00.000Z",
    updated_at: null,
  };
}

function makeHydrationPayload(
  overrides: Partial<OpenedGroupPayload> = {},
): OpenedGroupPayload {
  return {
    group: {
      id: "group-1",
      name: "Illinois TypeScript Enthusiasts",
      slug: "illinois-typescript-enthusiasts",
      description: "A TypeScript community.",
      location: "Online",
      category_id: "category-1",
      organizer_id: "organizer-1",
      created_at: "2026-08-01T12:00:00.000Z",
      updated_at: "2026-08-01T12:00:00.000Z",
    },
    layout: [],
    role: "member",
    numMembers: 2,
    organizerEmail: "organizer@example.com",
    calandar: [],
    nextEvent: undefined,
    category: undefined,
    ...overrides,
  };
}

describe("OpenedGroupSlice", () => {
  it("hydrates available next-event and category metadata", () => {
    const nextEvent = makeEvent();
    const category = {
      id: "category-1",
      name: "Technology",
      slug: "technology",
      icon: "computer",
    };

    const state = openedGroupReducer(
      undefined,
      hydrateGroup.fulfilled(
        makeHydrationPayload({ nextEvent, category }),
        "request-1",
        "illinois-typescript-enthusiasts",
      ),
    );

    expect(state.nextEvent).toEqual({ status: "ready", data: nextEvent });
    expect(state.category).toEqual({ status: "ready", data: category });
  });

  it("settles missing next-event and category metadata as unavailable", () => {
    const state = openedGroupReducer(
      undefined,
      hydrateGroup.fulfilled(
        makeHydrationPayload(),
        "request-1",
        "illinois-typescript-enthusiasts",
      ),
    );

    expect(state.nextEvent).toEqual({
      status: "n/a",
      message: "This Group does not have any upcoming events",
    });
    expect(state.category).toEqual({
      status: "n/a",
      message: "Could not find a valid category for this group",
    });
  });

  it("refreshes the next event alongside the event layout and calendar", () => {
    const nextEvent = makeEvent();
    const pendingState = openedGroupReducer(
      undefined,
      refreshGroupEvents.pending("request-1", "group-1"),
    );

    expect(pendingState.nextEvent).toEqual({ status: "pending" });

    const state = openedGroupReducer(
      pendingState,
      refreshGroupEvents.fulfilled(
        {
          refreshedEventsLayout: [],
          calandarEvents: [nextEvent],
          nextEvent,
        },
        "request-1",
        "group-1",
      ),
    );

    expect(state.nextEvent).toEqual({ status: "ready", data: nextEvent });
  });

  it("settles the next event as unavailable after an empty refresh", () => {
    const state = openedGroupReducer(
      undefined,
      refreshGroupEvents.fulfilled(
        {
          refreshedEventsLayout: [],
          calandarEvents: [],
          nextEvent: undefined,
        },
        "request-1",
        "group-1",
      ),
    );

    expect(state.nextEvent).toEqual({
      status: "n/a",
      message: "This Group does not have any upcoming events",
    });
  });

  it("settles the next event as failed when its refresh fails", () => {
    const pendingState = openedGroupReducer(
      undefined,
      refreshGroupEvents.pending("request-1", "group-1"),
    );
    const state = openedGroupReducer(
      pendingState,
      refreshGroupEvents.rejected(
        new Error("network unavailable"),
        "request-1",
        "group-1",
      ),
    );

    expect(state.nextEvent).toEqual({
      status: "failed",
      error: "Failed to refresh soonest upcoming event",
    });
  });
});
