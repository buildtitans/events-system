import { router } from "./init";
import { eventsRouter } from "./routers/eventsRouter";

export const appRouter = router({
    events: eventsRouter,
});

export type AppRouter = typeof appRouter;
