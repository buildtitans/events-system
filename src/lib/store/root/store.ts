import { configureStore } from "@reduxjs/toolkit";
import EventsSlice from "@/src/lib/store/slices/events/EventsSlice";
import GroupsSlice from "@/src/lib/store/slices/groups/GroupsSlice";
import RenderingSlice from "@/src/lib/store/slices/rendering/RenderingSlice";
import AuthSlice from "@/src/lib/store/slices/auth/AuthSlice";
import CategoriesSlice from "@/src/lib/store/slices/categories/CategorySlice";
import EventAttendantsSlice from "@/src/lib/store/slices/events/EventAttendantsSlice";
import EventDrawerSlice from "@/src/lib/store/slices/events/EventDrawerSlice";
import OpenedGroupSlice from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import NotificationSlice from "../slices/notifications/notificationSlice";
import UserSlice from "@/src/lib/store/slices/user/userSlice";
import ViewerSlice from "@/src/lib/store/slices/viewer/ViewerSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      events: EventsSlice,
      groups: GroupsSlice,
      rendering: RenderingSlice,
      auth: AuthSlice,
      categories: CategoriesSlice,
      viewer: ViewerSlice,
      eventAttendants: EventAttendantsSlice,
      eventDrawer: EventDrawerSlice,
      openGroup: OpenedGroupSlice,
      notifications: NotificationSlice,
      user: UserSlice,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
