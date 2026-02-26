import { router } from "@/src/server/bootstrap/init";
import { authRouter } from "../../server/router/routes/authRouter";
import { categoriesRouter } from "../../server/router/routes/categoriesRouter";
import { eventsRouter } from "../../server/router/routes/eventsRouter";
import { groupsRouter } from "../../server/router/routes/groupsRouter";
import { groupMembersRouter } from "../../server/router/routes/groupMembersRouter";
import { eventAttendantsRouter } from "../../server/router/routes/eventAttendantsRouter";
import { notificationsRouter } from "../../server/router/routes/notificationsRouter";

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
