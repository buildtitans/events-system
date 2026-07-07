import { router } from "@/src/server/core/context/init";
import { authRouter } from "./routes/authRouter";
import { categoriesRouter } from "./routes/categoriesRouter";
import { groupsRouter } from "./routes/groupsRouter";
import { groupMembersRouter } from "./routes/groupMembersRouter";
import { eventAttendantsRouter } from "./routes/eventAttendantsRouter";
import { notificationsRouter } from "./routes/notificationsRouter";
import { usersRouter } from "./routes/usersRouter";
import { geoCodingRouter } from "./routes/geoCodingRouter";
import { eventRouter } from "./routes/eventRouter";

export const appRouter = router({
  events: eventRouter,
  groups: groupsRouter,
  auth: authRouter,
  categories: categoriesRouter,
  groupMembers: groupMembersRouter,
  eventAttendants: eventAttendantsRouter,
  notifications: notificationsRouter,
  users: usersRouter,
  addressSearch: geoCodingRouter,
});

export type AppRouter = typeof appRouter;
