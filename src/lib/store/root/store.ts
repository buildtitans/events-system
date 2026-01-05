import { configureStore } from '@reduxjs/toolkit';
import EventCategories from '@/src/lib/store/slices/EventCategorySlice';

const store = configureStore({
    reducer: {
        categories: EventCategories,
    }
});

type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export { store };

export type { RootState, AppDispatch };