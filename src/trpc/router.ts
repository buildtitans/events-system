import { router } from "./init";
import { authRouter } from "./routers/authRouter";
import { categoriesRouter } from "./routers/categoriesRouter";
import { eventsRouter } from "./routers/eventsRouter";
import { groupsRouter } from "./routers/groupsRouter";
import { groupMembersRouter } from "./routers/groupMembersRouter";
import { eventAttendantsRouter } from "./routers/eventAttendantsRouter";
import { notificationsRouter } from "./routers/notificationsRouter";

export const appRouter = router({
    events: eventsRouter,
    groups: groupsRouter,
    auth: authRouter,
    categories: categoriesRouter,
    groupMembers: groupMembersRouter,
    eventAttendants: eventAttendantsRouter,
    notifications: notificationsRouter
});

export type AppRouter = typeof appRouter;
