"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { signalDomainStatus } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { useEffect } from "react";
import { DomainStateType } from "@/src/lib/store/sync/syncDomains";
import { getAllGroups } from "@/src/lib/store/slices/groups/GroupsSlice";
import { chunkEventPages } from "@/src/lib/store/slices/events/EventsSlice";
import { getAllCategories } from "@/src/lib/store/slices/categories/CategorySlice";
import { useRecoverSession } from "@/src/lib/hooks/auth/useRecoverSession";
import { useHydrateNotifications } from "@/src/lib/hooks/hydration/useHydrateNotifications";

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
            dispatch(getAllGroups(groups));
            dispatch(chunkEventPages(events));
            dispatch(getAllCategories(categories));
        };

        const hydrateDomains = async () => {
            dispatch(signalDomainStatus("pending"));

            const {
                events,
                groups,
                categories
            } = domains;

            dispatchDomains(
                events,
                groups,
                categories
            );



            dispatch(signalDomainStatus("idle"));
        };

        void hydrateDomains();

    }, [domains, dispatch]);

    return null;
};