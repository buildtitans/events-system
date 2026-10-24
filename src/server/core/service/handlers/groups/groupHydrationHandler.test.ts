import { GroupHydrationHandler } from "./groupHydrationHandler";
import { EventLayoutComposer } from "../events/eventLayoutComposer";
import { createMockDb } from "../../tests/mockers/mocks";
import { makeHydratedGroup, makeNextEvent, makeTimelineItem } from "@/src/test/fixtures/groupHydration";
import { USER_ID } from "../../tests/mockers/mockValues";

 describe("GroupHydrationHandler.single", () => {
  it.each([true, false])("assembles a validated nested response (has events: %s)", async hasEvents => {
    const db = createMockDb();
    const base = makeHydratedGroup({}, { viewer_role: "member" });
    const nextEvent = makeNextEvent();
    const calendar = hasEvents ? [makeTimelineItem()] : [];
    const events = hasEvents ? [nextEvent] : [];
    const { events: unused, ...metadata } = base.meta;
    void unused;
    const read = jest.fn<ReturnType<typeof db.groups.select.hydrateGroup>, Parameters<typeof db.groups.select.hydrateGroup>>();
    db.groups.select.hydrateGroup = read;
    read.mockResolvedValue({ group: base.group, meta: { ...metadata, group_events: events, calandar: calendar, next_event: hasEvents ? nextEvent : undefined } });
    const handler = new GroupHydrationHandler(db, new EventLayoutComposer());
    const result = await handler.single(base.group.slug, USER_ID);
    expect(read).toHaveBeenCalledWith(base.group.slug, USER_ID);
    expect(result.meta.viewer_role).toBe("member");
    expect(result.meta.events.calandar).toEqual(calendar);
    expect(result.meta.events.next_event).toEqual(hasEvents ? nextEvent : undefined);
    expect(result.meta.events.group_events).toEqual(hasEvents ? [[expect.objectContaining({ kind: "card", event: { for: "withinGroup", content: nextEvent } })]] : []);
    expect(result.meta).not.toHaveProperty("calandar");
    expect(result.meta).not.toHaveProperty("next_event");
  });
});
