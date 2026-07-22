import { combineReducers } from "@reduxjs/toolkit";
import EventSlice from "@/src/lib/store/slices/events/EventsSlice";
import EventDrawerSlice from "@/src/lib/store/slices/events/EventDrawerSlice";
import GroupsSlice from "@/src/lib/store/slices/groups/GroupsSlice";
import OpenedGroupSlice from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import CategorySlice from "@/src/lib/store/slices/categories/CategorySlice";

const groupsDomainReducer = combineReducers({
  collection: GroupsSlice,
  opened: OpenedGroupSlice,
});

const eventsDomainReducer = combineReducers({
  collection: EventSlice,
  opened: EventDrawerSlice,
});

const domainsReducer = combineReducers({
  events: eventsDomainReducer,
  groups: groupsDomainReducer,
  categories: CategorySlice,
});

export { domainsReducer };
