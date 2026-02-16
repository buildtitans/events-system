import { configureStore } from '@reduxjs/toolkit';
import EventsSlice from '@/src/lib/store/slices/events/EventsSlice';
import GroupsSlice from "@/src/lib/store/slices/groups/GroupsSlice"
import RenderingSlice from "@/src/lib/store/slices/rendering/RenderingSlice";
import AuthSlice from "@/src/lib/store/slices/auth/AuthSlice";
import CategoriesSlice from "@/src/lib/store/slices/categories/CategorySlice";
import PermissionsSlice from '@/src/lib/store/slices/viewer/PermissionsSlice';
import EventAttendantsSlice from "@/src/lib/store/slices/events/EventAttendantsSlice";
import EventDrawerSlice from "@/src/lib/store/slices/events/EventDrawerSlice";
import OpenedGroupSlice from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import NotificationSlice from '../slices/notifications/notificationSlice';

const store = configureStore({
    reducer: {
        events: EventsSlice,
        groups: GroupsSlice,
        rendering: RenderingSlice,
        auth: AuthSlice,
        categories: CategoriesSlice,
        groupMembers: PermissionsSlice,
        eventAttendants: EventAttendantsSlice,
        eventDrawer: EventDrawerSlice,
        openGroup: OpenedGroupSlice,
        notifications: NotificationSlice
    }
});

type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export { store };

export type { RootState, AppDispatch };