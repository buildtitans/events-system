import { router } from "./init";
import { eventsRouter } from "./routers/eventsRouter";
import { groupsRouter } from "./routers/groupsRouter";

export const appRouter = router({
    events: eventsRouter,
    groups: groupsRouter
});

export type AppRouter = typeof appRouter;
