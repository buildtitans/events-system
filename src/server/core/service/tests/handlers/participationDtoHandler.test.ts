import { ParticipationDtoHandler } from "@/src/server/core/service/handlers/participations/participationDtoHandler";
import { makeEvent } from "@/src/server/core/service/tests/mockers/mocks";

describe("ParticipationDtoHandler.toRsvpShape", () => {
  let handler: ParticipationDtoHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    handler = new ParticipationDtoHandler();
  });

  it("maps events, group lookup data, and attendance statuses into RSVP shapes", () => {
    const groupId1 = "5cf76d94-83c9-46de-90ac-fe4047a00000";
    const groupId2 = "6cf76d94-83c9-46de-90ac-fe4047a00000";
    const eventId1 = "7cf76d94-83c9-46de-90ac-fe4047a00000";
    const eventId2 = "8cf76d94-83c9-46de-90ac-fe4047a00000";

    const events = [
      makeEvent({
        id: eventId1,
        group_id: groupId1,
        title: "Board Game Night",
        meeting_location: "Downtown Cafe",
      }),
      makeEvent({
        id: eventId2,
        group_id: groupId2,
        title: "Frontend Study Session",
        meeting_location: "Online",
      }),
    ];

    const groupNameHash = {
      [groupId1]: {
        name: "Board Gamers",
        slug: "board-gamers",
      },
      [groupId2]: {
        name: "Frontend Crew",
        slug: "frontend-crew",
      },
    };

    const statusLookup = {
      [eventId1]: "going" as const,
      [eventId2]: "interested" as const,
    };

    expect(handler.toRsvpShape(events, groupNameHash, statusLookup)).toEqual([
      {
        event_id: eventId1,
        group_id: groupId1,
        group_name: "Board Gamers",
        starts_at: events[0].starts_at,
        starts_at_ms: events[0].starts_at_ms,
        scheduled_status: events[0].status,
        location: "Downtown Cafe",
        attendance_status: "going",
        event_title: "Board Game Night",
        group_slug: "board-gamers",
      },
      {
        event_id: eventId2,
        group_id: groupId2,
        group_name: "Frontend Crew",
        starts_at: events[1].starts_at,
        starts_at_ms: events[1].starts_at_ms,
        scheduled_status: events[1].status,
        location: "Online",
        attendance_status: "interested",
        event_title: "Frontend Study Session",
        group_slug: "frontend-crew",
      },
    ]);
  });
});
