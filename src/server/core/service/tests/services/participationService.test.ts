import type { RsvpSurfaceSchemaType } from "@/src/schemas/events/rsvpSchema";
import { ParticipationsService } from "@/src/server/core/service/services/participationsService";
import {
  createMockDb,
  policyMock,
  makeAttendanceUpdate,
  makeRsvp,
  authenticateAs,
  unauthenticated,
} from "@/src/server/core/service/tests/mockers/mocks";
import {
  USER_ID,
  EVENT_ID,
} from "@/src/server/core/service/tests/mockers/mockValues";
import { EventAttendantStatusSchemaType } from "@/src/schemas/events/eventAttendantsSchema";

describe("ParticipationsService", () => {
  let service: ParticipationsService;
  let db: ReturnType<typeof createMockDb>;
  let updateAttendanceStatusInDb: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    updateAttendanceStatusInDb = db.eventAttendants.write
      .updateAttendanceStatus as jest.Mock;
    service = new ParticipationsService(db, policyMock);
  });

  describe("updateRsvpStatus", () => {
    const newStatus: EventAttendantStatusSchemaType = "going";

    it("throws a 401 error when the user is not authenticated", async () => {
      unauthenticated();

      await expect(
        service.attendance.updateRsvpStatus(null, EVENT_ID, newStatus),
      ).rejects.toThrow("401");

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(null);
      expect(updateAttendanceStatusInDb).not.toHaveBeenCalled();
    });

    it("updates the attendance status when the user is authenticated", async () => {
      authenticateAs();

      updateAttendanceStatusInDb.mockResolvedValue(
        makeAttendanceUpdate(
          { user_id: USER_ID, event_id: EVENT_ID },
          newStatus,
        ),
      );

      await expect(
        service.attendance.updateRsvpStatus(USER_ID, EVENT_ID, newStatus),
      ).resolves.toMatchObject(
        makeAttendanceUpdate(
          { user_id: USER_ID, event_id: EVENT_ID },
          newStatus,
        ),
      );

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
      expect(updateAttendanceStatusInDb).toHaveBeenCalledWith(
        { event_id: EVENT_ID, user_id: USER_ID },
        newStatus,
      );
    });
  });

  describe("rsvps", () => {
    it("does not read RSVPs when authentication fails", async () => {
      unauthenticated();

      await expect(service.attendance.rsvps(undefined)).rejects.toThrow("401");
      expect(db.eventAttendants.select.rsvps).not.toHaveBeenCalled();
    });

    it("returns the authenticated user's RSVP surfaces", async () => {
      authenticateAs();
      const surfaces: RsvpSurfaceSchemaType[] = [
        {
          rsvp: makeRsvp({ event_id: EVENT_ID }),
          meta: {
            group_name: "Test group",
            group_slug: "test-group",
            category_name: "technology",
          },
        },
      ];
      (db.eventAttendants.select.rsvps as jest.Mock).mockResolvedValue(
        surfaces,
      );

      await expect(service.attendance.rsvps(USER_ID)).resolves.toBe(surfaces);
      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
      expect(db.eventAttendants.select.rsvps).toHaveBeenCalledWith(USER_ID);
    });

    it("returns an empty collection when there are no RSVPs", async () => {
      authenticateAs();
      (db.eventAttendants.select.rsvps as jest.Mock).mockResolvedValue([]);

      await expect(service.attendance.rsvps(USER_ID)).resolves.toEqual([]);
    });
  });
});
