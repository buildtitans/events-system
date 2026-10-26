import { USER_ID } from "../mockers/mockValues";
import type { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import { EventQueryHandler } from "@/src/server/core/service/handlers/events/eventQueryHandler";
import { createMockDb, makeEvent, makeGroup } from "../mockers/mocks";

 describe("EventQueryHandler.hydrate", () => {
  it.each([USER_ID, undefined])("returns the complete persistence read without additional user lookups (%s)", async userId => {
    const db = createMockDb();
    const group = makeGroup();
    const result: HydratedEventSchemaType = {
      event: makeEvent(),
      meta: {
        event: { group_name: group.name, group_slug: group.slug, attendants: { going: 2, interested: 1 } },
        user: userId ? { status: "interested", role: "organizer" } : { status: "not_going", role: "anonymous" },
      },
    };
    const hydrate = jest.mocked(db.events.select.view.single);
    hydrate.mockResolvedValue(result);
    await expect(new EventQueryHandler(db).hydrate(result.event.id, userId)).resolves.toEqual(result);
    expect(hydrate).toHaveBeenCalledWith(result.event.id, userId);
    expect(hydrate).toHaveBeenCalledTimes(1);
    expect(db.eventAttendants.select.rsvp).not.toHaveBeenCalled();
    expect(db.groupMembers.select.role).not.toHaveBeenCalled();
  });

  it("propagates missing-event failures", async () => {
    const db = createMockDb();
    jest.mocked(db.events.select.view.single).mockRejectedValue(new Error("Event not found"));
    await expect(new EventQueryHandler(db).hydrate("missing", USER_ID)).rejects.toThrow("Event not found");
  });
});
