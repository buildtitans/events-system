import { router } from "../../context/init";
import { groupRouter } from "./groupsRouter";
import { notificationRouter } from "./notificationsRouter";
import { userRouter } from "./usersRouter";

export const entitiesRoute = router({
  group: groupRouter,
  user: userRouter,
  notifications: notificationRouter,
});
