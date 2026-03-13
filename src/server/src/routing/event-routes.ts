import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  ValidateGroupId,
  ValidateEventSearchQuery,
} from "../lib/validation/schemaValidators";

type GroupParams = {
  groupId: string;
};

export async function eventRoutes(app: FastifyInstance) {
  app.get("/events", async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const events = await app.db.events.getFlattenedEvents();
      return reply.code(200).send(events);
    } catch (error) {
      app.log.error({ error }, "Failed to fetch flattened events");
      return reply
        .code(500)
        .send({ error: "Failed to fetch events from the 'events' table" });
    }
  });

  app.get(
    "/events/layout",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        if (!req.services) {
          return reply.code(500).send({ error: "Services not initialized" });
        }

        const events = await app.db.events.getFlattenedEvents();
        const layout = req.services.formatLayout.compileLayout(events);

        return reply.code(200).send(layout);
      } catch (error) {
        app.log.error({ error }, "Failed to fetch events layout");
        return reply.code(500).send({ error: "Failed to build events layout" });
      }
    },
  );

  app.get<{ Params: GroupParams }>(
    "/groups/:groupId/events",
    async (req, reply) => {
      try {
        const groupId = ValidateGroupId(req.params.groupId)
          ? req.params.groupId
          : null;

        if (!groupId) {
          return reply.code(400).send({ error: "Invalid group id" });
        }

        const events = await app.db.events.getGroupEventsByGroupId(groupId);
        return reply.code(200).send(events);
      } catch (error) {
        app.log.error({ error }, "Failed to fetch group events");
        return reply
          .code(500)
          .send({ error: "Failed to fetch events for this group" });
      }
    },
  );

  app.get<{ Params: GroupParams }>(
    "/groups/:groupId/events/layout",
    async (req, reply) => {
      try {
        const groupId = ValidateGroupId(req.params.groupId)
          ? req.params.groupId
          : null;

        if (!groupId) {
          return reply.code(400).send({ error: "Invalid group id" });
        }

        if (!req.services) {
          return reply.code(500).send({ error: "Services not initialized" });
        }

        const events = await app.db.events.getGroupEventsByGroupId(groupId);
        const layout = req.services.formatLayout.compileLayout(events);

        return reply.code(200).send(layout);
      } catch (error) {
        app.log.error({ error }, "Failed to fetch group events layout");
        return reply
          .code(500)
          .send({ error: "Failed to build group events layout" });
      }
    },
  );

  app.post(
    "/events/search",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const query = ValidateEventSearchQuery(req.body);
        const results = await app.db.events.searchEventByTitle(query);

        return reply.code(200).send(results);
      } catch (error) {
        app.log.error({ error }, "Unexpected error occurred on event search");
        return reply.code(500).send({ error: "Failed to search events" });
      }
    },
  );
}
