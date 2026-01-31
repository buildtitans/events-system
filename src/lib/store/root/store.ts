import { configureStore } from '@reduxjs/toolkit';
import EventsSlice from '@/src/lib/store/slices/EventsSlice';
import GroupsSlice from "@/src/lib/store/slices/GroupsSlice"
import RenderingSlice from "@/src/lib/store/slices/RenderingSlice";
import AuthSlice from "@/src/lib/store/slices/AuthSlice";
import CategoriesSlice from "@/src/lib/store/slices/CategorySlice";
import GroupMembersSlice from '@/src/lib/store/slices/GroupMembersSlice';

const store = configureStore({
    reducer: {
        events: EventsSlice,
        groups: GroupsSlice,
        rendering: RenderingSlice,
        auth: AuthSlice,
        categories: CategoriesSlice,
        groupMembers: GroupMembersSlice
    }
});

type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export { store };

export type { RootState, AppDispatch };