import { router } from "./init";
import { authRouter } from "./routers/authRouter";
import { categoriesRouter } from "./routers/categoriesRouter";
import { eventsRouter } from "./routers/eventsRouter";
import { groupsRouter } from "./routers/groupsRouter";
import { groupMembersRouter } from "./routers/groupMembersRouter";

export const appRouter = router({
    events: eventsRouter,
    groups: groupsRouter,
    auth: authRouter,
    categories: categoriesRouter,
    groupMembers: groupMembersRouter
});

export type AppRouter = typeof appRouter;
