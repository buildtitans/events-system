import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

export async function eventRoutes(app: FastifyInstance) {
  app.get("/", (req: FastifyRequest, res: FastifyReply) => {
    if (!req.services) {
      res.code(500).send({ error: "Services not initialized" });
    }
  });

  app.get(
    "/events/allEvents",
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const events = await app.db.events.getFlattenedEvents();

        if (!req.services) {
          throw new Error("Services not initialized");
        }

        const eventsLayout = req.services.formatLayout.compileLayout(events);

        res.send(eventsLayout);
      } catch (error) {
        res
          .code(500)
          .send({ error: "Failed to fetch from the 'events' table" });
        app.log.error({ error }, "Unexpected error fetching events");
      }
    },
  );

  //
  //  app.get("/events/search", async (req: FastifyRequest, reply: FastifyReply) => {
  //
  //    const results = await
  //
  //  })
  //
}
