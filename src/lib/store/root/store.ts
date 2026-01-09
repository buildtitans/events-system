import { configureStore } from '@reduxjs/toolkit';
import EventCategories from '@/src/lib/store/slices/EventCategorySlice';
import GroupsSlice from "@/src/lib/store/slices/GroupsSlice"

const store = configureStore({
    reducer: {
        categories: EventCategories,
        groups: GroupsSlice
    }
});

type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export { store };

export type { RootState, AppDispatch };