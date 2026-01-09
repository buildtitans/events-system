import { configureStore } from '@reduxjs/toolkit';
import EventCategories from '@/src/lib/store/slices/EventCategorySlice';
import GroupsSlice from "@/src/lib/store/slices/GroupsSlice"
import RenderingSlice from "@/src/lib/store/slices/RenderingSlice";

const store = configureStore({
    reducer: {
        categories: EventCategories,
        groups: GroupsSlice,
        rendering: RenderingSlice
    }
});

type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export { store };

export type { RootState, AppDispatch };