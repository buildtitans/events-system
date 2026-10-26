jest.mock("./thunks", () => {
  const { createAsyncThunk } = jest.requireActual("@reduxjs/toolkit") as typeof import("@reduxjs/toolkit");
  return { hydrateEventDrawer: createAsyncThunk("EventDrawer/hydrate", async () => null), updateRSVP: createAsyncThunk("EventSlice/updateRSVP", async () => null) };
});
import reducer, { closeEventDrawer } from "./EventDrawerSlice";
import { hydrateEventDrawer, updateRSVP } from "./thunks";
import type { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import type { RsvpUpdateResponseSchemaType } from "@/src/schemas/events/rsvpSchema";
import { makeNextEvent } from "@/src/test/fixtures/groupHydration";

function makeEvent(): HydratedEventSchemaType {
  return { event: { ...makeNextEvent().event, created_at: "2030-01-01T12:00:00Z", updated_at: null }, meta: { event: { group_name: "Community", group_slug: "community", attendants: { going: 0, interested: 2 } }, user: { status: "not_going", role: "member" } } };
}
function makeResponse(event_id = "event-1"): RsvpUpdateResponseSchemaType {
  return { updated: { event_id, user_id: "user-1", status: "going", created_at: "2030-01-01T12:00:00Z", updated_at: null }, headCount: { going: 3, interested: 1 } };
}
 describe("EventDrawerSlice RSVP responses", () => {
  it("updates the current event status and authoritative attendance counts", () => {
    const event = makeEvent();
    const ready = reducer(undefined, hydrateEventDrawer.fulfilled(event, "hydrate-1", event.event.id));
    const state = reducer(ready, updateRSVP.fulfilled(makeResponse(), "rsvp-1", { event_id: event.event.id, newStatus: "going" }));
    expect(state.event).toMatchObject({ status: "ready", data: { meta: { user: { status: "going", role: "member" }, event: { attendants: { going: 3, interested: 1 } } } } });
  });
  it("ignores a response for a different event", () => {
    const event = makeEvent();
    const ready = reducer(undefined, hydrateEventDrawer.fulfilled(event, "hydrate-1", event.event.id));
    expect(reducer(ready, updateRSVP.fulfilled(makeResponse("other-event"), "rsvp-1", { event_id: "other-event", newStatus: "going" }))).toEqual(ready);
  });
  it("ignores an RSVP response after the drawer is closed", () => {
    const closed = reducer(undefined, closeEventDrawer());
    expect(reducer(closed, updateRSVP.fulfilled(makeResponse(), "rsvp-1", { event_id: "event-1", newStatus: "going" }))).toEqual(closed);
  });
});
