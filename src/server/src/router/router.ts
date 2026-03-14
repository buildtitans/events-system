import { router } from "@/src/server/src/context/init";
import { authRouter } from "./routes/authRouter";
import { categoriesRouter } from "./routes/categoriesRouter";
import { eventsRouter } from "./routes/eventsRouter";
import { groupsRouter } from "./routes/groupsRouter";
import { groupMembersRouter } from "./routes/groupMembersRouter";
import { eventAttendantsRouter } from "./routes/eventAttendantsRouter";
import { notificationsRouter } from "./routes/notificationsRouter";
import { usersRouter } from "./routes/usersRouter";

export const appRouter = router({
  events: eventsRouter,
  groups: groupsRouter,
  auth: authRouter,
  categories: categoriesRouter,
  groupMembers: groupMembersRouter,
  eventAttendants: eventAttendantsRouter,
  notifications: notificationsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
