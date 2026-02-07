import { configureStore } from '@reduxjs/toolkit';
import EventsSlice from '@/src/lib/store/slices/EventsSlice';
import GroupsSlice from "@/src/lib/store/slices/GroupsSlice"
import RenderingSlice from "@/src/lib/store/slices/RenderingSlice";
import AuthSlice from "@/src/lib/store/slices/AuthSlice";
import CategoriesSlice from "@/src/lib/store/slices/CategorySlice";
import GroupMembersSlice from '@/src/lib/store/slices/GroupMembersSlice';
import EventAttendantsSlice from "@/src/lib/store/slices/EventAttendantsSlice";
import EventDrawerSlice from "@/src/lib/store/slices/events/EventDrawerSlice";
import OpenedGroupSlice from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { DomainStateType } from '../sync/syncDomains';

//TODO: Check redux toolkit docs on this pattern

//const hydrateStore = (preloadedState: DomainStateType) => {
//    return configureStore({
//        reducer: {
//            events: EventsSlice,
//            groups: GroupsSlice,
//            rendering: RenderingSlice,
//            auth: AuthSlice,
//            categories: CategoriesSlice,
//            groupMembers: GroupMembersSlice,
//            eventAttendants: EventAttendantsSlice,
//            eventDrawer: EventDrawerSlice,
//            openGroup: OpenedGroupSlice
//
//        },
//        preloadedState
//    })
//}

const store = configureStore({
    reducer: {
        events: EventsSlice,
        groups: GroupsSlice,
        rendering: RenderingSlice,
        auth: AuthSlice,
        categories: CategoriesSlice,
        groupMembers: GroupMembersSlice,
        eventAttendants: EventAttendantsSlice,
        eventDrawer: EventDrawerSlice,
        openGroup: OpenedGroupSlice
    }
});

type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export { store };

export type { RootState, AppDispatch };