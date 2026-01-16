import { configureStore } from '@reduxjs/toolkit';
import EventCategories from '@/src/lib/store/slices/EventCategorySlice';
import GroupsSlice from "@/src/lib/store/slices/GroupsSlice"
import RenderingSlice from "@/src/lib/store/slices/RenderingSlice";
import AuthSlice from "@/src/lib/store/slices/AuthSlice";

const store = configureStore({
    reducer: {
        events: EventCategories,
        groups: GroupsSlice,
        rendering: RenderingSlice,
        auth: AuthSlice
    }
});

type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export { store };

export type { RootState, AppDispatch };