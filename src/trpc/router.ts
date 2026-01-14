import { router } from "./init";
import { authRouter } from "./routers/authRouter";
import { eventsRouter } from "./routers/eventsRouter";
import { groupsRouter } from "./routers/groupsRouter";

export const appRouter = router({
    events: eventsRouter,
    groups: groupsRouter,
    auth: authRouter
});

export type AppRouter = typeof appRouter;
