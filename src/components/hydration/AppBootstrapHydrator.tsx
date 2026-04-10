"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { signalDomainStatus } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { useEffect } from "react";
import { DomainStateType } from "@/src/lib/types/server/types";
import { getAllGroups } from "@/src/lib/store/slices/groups/GroupsSlice";
import { populateEvents } from "@/src/lib/store/slices/events/EventsSlice";
import { getAllCategories } from "@/src/lib/store/slices/categories/CategorySlice";
import { createCategoryLookup } from "@/src/lib/utils/helpers/categories/createCategoryLookup";
import { getCatLookup } from "@/src/lib/store/slices/categories/CategorySlice";
import { getNameLookup } from "@/src/lib/store/slices/groups/GroupsSlice";
import { useRecoverSession } from "@/src/lib/hooks/auth/useRecoverSession";
import { useHydrateNotifications } from "@/src/lib/hooks/hydration/useHydrateNotifications";
import { syncDomains } from "@/src/lib/store/sync/syncDomains";

export default function AppBootstrapHydrator(): React.ReactNode {
  useRecoverSession();
  useHydrateNotifications();
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => { 

    const executeHydrateDomains = async () => {
      const domains = await syncDomains();

      hydrateDomains(domains.data);
    }

    const dispatchDomains = (
      events: DomainStateType["events"],
      groups: DomainStateType["groups"],
      categories: DomainStateType["categories"],
      groupNameDictionary: DomainStateType["groupNameDictionary"]
    ) => {
      if (groups.length === 0 || events.length === 0) {
        dispatch(signalDomainStatus("failed"));
        return;
      } 

      dispatch(getNameLookup(groupNameDictionary));

      dispatch(getAllGroups(groups));

      dispatch(populateEvents({ status: "ready", data: events }));

      const lookup = createCategoryLookup(groups);

      dispatch(getCatLookup({ status: "ready", data: lookup }));

      dispatch(getAllCategories(categories));

      dispatch(signalDomainStatus("idle"));
    };

    const hydrateDomains = async (domains: DomainStateType) => {
      dispatch(signalDomainStatus("pending"));
      dispatch(populateEvents({ status: "pending" }));

      dispatchDomains(domains.events, domains.groups, domains.categories, domains.groupNameDictionary);
    };

    void executeHydrateDomains();

  }, [dispatch]);

  return null;
}
