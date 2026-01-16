import { router } from "./init";
import { authRouter } from "./routers/authRouter";
import { categoriesRouter } from "./routers/categoriesRouter";
import { eventsRouter } from "./routers/eventsRouter";
import { groupsRouter } from "./routers/groupsRouter";

export const appRouter = router({
    events: eventsRouter,
    groups: groupsRouter,
    auth: authRouter,
    categories: categoriesRouter
});

export type AppRouter = typeof appRouter;
