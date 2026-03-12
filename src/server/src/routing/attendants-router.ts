import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { curatePopularEventsIds } from "@/src/server/src/lib/utils/curatePopularEventsIds";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";

type EventParams = {
  eventId: string;
};

type UpdateAttendanceBody = {
  newStatus: EventAttendantsSchemaType["status"];
};

function getRequestUserId(req: FastifyRequest): string | undefined {
  const userId = req.user?.id;

  if (typeof userId === "string") return userId;
  if (typeof userId === "number") return String(userId);

  return undefined;
}

export async function eventAttendantsRoutes(app: FastifyInstance) {
  // GET /events/:eventId/attendants
  app.get<{ Params: EventParams }>(
    "/events/:eventId/attendants",
    async (req, reply) => {
      try {
        const { eventId } = req.params;

        if (!eventId) {
          return reply.code(400).send({ error: "Invalid event id" });
        }

        const attendants = await app.db.eventAttendants.getAttendants(eventId);

        return reply.code(200).send(attendants);
      } catch (error) {
        app.log.error({ error }, "Failed to fetch attendants");
        return reply
          .code(500)
          .send({ error: "Failed to fetch event attendants" });
      }
    },
  );

  // GET /users/me/attendance-records
  app.get(
    "/users/me/attendance-records",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = getRequestUserId(req);

        if (!userId) {
          return reply.code(401).send({
            error:
              "Authenticated session required to access attendance records",
          });
        }

        const records =
          await app.db.eventAttendants.getUserAttendanceRecords(userId);

        return reply.code(200).send(records);
      } catch (error) {
        app.log.error({ error }, "Failed to fetch user attendance records");
        return reply
          .code(500)
          .send({ error: "Failed to fetch user attendance records" });
      }
    },
  );

  // PATCH /events/:eventId/attendance
  app.patch<{ Params: EventParams; Body: UpdateAttendanceBody }>(
    "/events/:eventId/attendance",
    async (req, reply) => {
      try {
        const { eventId } = req.params;
        const { newStatus } = req.body;
        const userId = getRequestUserId(req);

        if (!userId) {
          return reply.code(401).send({
            error: "Authenticated session required to update attendance",
          });
        }

        if (!eventId || !newStatus) {
          return reply
            .code(400)
            .send({ error: "Event id and new status are required" });
        }

        const updated = await app.db.eventAttendants.updateAttendanceStatus(
          {
            event_id: eventId,
            user_id: userId,
          },
          newStatus,
        );

        return reply.code(200).send(updated);
      } catch (error) {
        app.log.error({ error }, "Failed to update attendance status");
        return reply
          .code(500)
          .send({ error: "Failed to update attendance status" });
      }
    },
  );

  // GET /events/:eventId/viewer-attendance
  // Composed response similar to your old getViewerAttendance resolver
  app.get<{ Params: EventParams }>(
    "/events/:eventId/viewer-attendance",
    async (req, reply) => {
      try {
        const { eventId } = req.params;
        const userId = getRequestUserId(req);

        if (!eventId) {
          return reply.code(400).send({ error: "Invalid event id" });
        }

        if (!req.services) {
          return reply.code(500).send({ error: "Services not initialized" });
        }

        const { numGoing, numInterested } =
          await req.services.censusClient.getNumberOfAttendantsForEvent(
            eventId,
          );

        let currentUserStatus: EventAttendantsSchemaType["status"] | null =
          null;

        if (userId) {
          const records =
            await app.db.eventAttendants.getUserAttendanceRecords(userId);

          const match = records.find((record) => record.event_id === eventId);
          currentUserStatus = match?.status ?? null;
        }

        return reply.code(200).send({
          currentUserStatus,
          numGoing,
          numInterested,
        });
      } catch (error) {
        app.log.error({ error }, "Failed to fetch viewer attendance");
        return reply
          .code(500)
          .send({ error: "Failed to fetch viewer attendance data" });
      }
    },
  );

  // GET /events/popular/ids
  app.get(
    "/events/popular/ids",
    async (_req: FastifyRequest, reply: FastifyReply) => {
      try {
        const records = await app.db.eventAttendants.getAllAttendanceRecords();
        const ids = curatePopularEventsIds(records);

        return reply.code(200).send(ids);
      } catch (error) {
        app.log.error({ error }, "Failed to fetch popular event ids");
        return reply
          .code(500)
          .send({ error: "Failed to fetch popular event ids" });
      }
    },
  );

  // GET /users/me/rsvpd-events
  // Composed route using services.participationsClient
  app.get(
    "/users/me/rsvpd-events",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = getRequestUserId(req);

        if (!userId) {
          return reply.code(403).send({
            error: "Permission to access user data denied",
          });
        }

        if (!req.services) {
          return reply.code(500).send({ error: "Services not initialized" });
        }

        const events =
          await req.services.participationsClient.getRsvpdEvents(userId);

        return reply.code(200).send(events);
      } catch (error) {
        app.log.error({ error }, "Failed to fetch RSVP'd events");
        return reply.code(500).send({ error: "Failed to fetch RSVP'd events" });
      }
    },
  );
}
