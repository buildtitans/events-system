import { router } from "@/src/server/core/context/init";
import { authRouter } from "./routes/authRouter";
import { categoriesRouter } from "./routes/categoriesRouter";
import { groupRouter } from "./routes/groupsRouter";
import { membersRouter } from "./routes/groupMembersRouter";
import { attendantsRouter } from "./routes/eventAttendantsRouter";
import { notificationRouter } from "./routes/notificationsRouter";
import { userRouter } from "./routes/usersRouter";
import { geoCodingRouter } from "./routes/geoCodingRouter";
import { eventRouter } from "./routes/eventRouter";

export const appRouter = router({
  events: eventRouter,
  groups: groupRouter,
  auth: authRouter,
  categories: categoriesRouter,
  groupMembers: membersRouter,
  eventAttendants: attendantsRouter,
  notifications: notificationRouter,
  users: userRouter,
  addressSearch: geoCodingRouter,
});

export type AppRouter = typeof appRouter;
