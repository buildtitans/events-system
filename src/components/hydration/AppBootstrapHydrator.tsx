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
import { useRecoverSession } from "@/src/lib/hooks/auth/useRecoverSession";
import { useHydrateNotifications } from "@/src/lib/hooks/hydration/useHydrateNotifications";
import { wait } from "@/src/lib/utils/rendering/wait";

export default function AppBootstrapHydrator({ domains }: { domains: DomainStateType }): React.ReactNode {
    useRecoverSession();
    useHydrateNotifications();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (!domains) return;

        const dispatchDomains = (
            events: DomainStateType["events"],
            groups: DomainStateType["groups"],
            categories: DomainStateType["categories"]
        ) => {

            if ((groups.length === 0) || (events.length === 0)) {
                dispatch(signalDomainStatus("failed"));
                return;
            }

            dispatch(getAllGroups(groups));

            dispatch(populateEvents({ status: "ready", data: events, filter: "All Events" }));

            const lookup = createCategoryLookup(groups);

            dispatch(getCatLookup({ status: "ready", data: lookup }));

            dispatch(getAllCategories(categories));

            dispatch(signalDomainStatus("idle"));

        };

        const hydrateDomains = async () => {

            dispatch(signalDomainStatus("pending"));
            dispatch(populateEvents({ status: "pending", filter: "All Events" }));

            await wait(1200);

            dispatchDomains(
                domains.events,
                domains.groups,
                domains.categories
            );
        };

        void hydrateDomains();

    }, [domains, dispatch]);

    return null;
};