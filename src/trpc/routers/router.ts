import { router } from "@/src/trpc/init/init";
import { authRouter } from "./routes/authRouter";
import { categoriesRouter } from "./routes/categoriesRouter";
import { eventsRouter } from "./routes/eventsRouter";
import { groupsRouter } from "./routes/groupsRouter";
import { groupMembersRouter } from "./routes/groupMembersRouter";
import { eventAttendantsRouter } from "./routes/eventAttendantsRouter";
import { notificationsRouter } from "./routes/notificationsRouter";

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
