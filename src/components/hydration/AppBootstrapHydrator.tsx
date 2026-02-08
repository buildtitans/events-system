"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { signalDomainStatus } from "@/src/lib/store/slices/RenderingSlice";
import { useEffect } from "react";
import { DomainStateType } from "@/src/lib/store/sync/syncDomains";
import { getAllGroups } from "@/src/lib/store/slices/GroupsSlice";
import { chunkEventPages } from "@/src/lib/store/slices/EventsSlice";
import { getAllCategories } from "@/src/lib/store/slices/CategorySlice";
import { useRecoverSession } from "@/src/lib/hooks/auth/useRecoverSession";

export default function AppBootstrapHydrator({ domains }: { domains: DomainStateType }): React.ReactNode {
    useRecoverSession();
    const dispatch = useDispatch<AppDispatch>();

    async function dispatchDomains(
        events: DomainStateType["events"],
        groups: DomainStateType["groups"],
        categories: DomainStateType["categories"]
    ): Promise<void> {

        dispatch(getAllGroups(groups));
        dispatch(chunkEventPages(events));
        dispatch(getAllCategories(categories));
    };

    useEffect(() => {
        if (!domains) return;

        const hydrateDomains = async () => {
            dispatch(signalDomainStatus("pending"));

            const {
                events,
                groups,
                categories
            } = domains;

            await dispatchDomains(
                events,
                groups,
                categories
            );



            dispatch(signalDomainStatus("idle"));
        };

        void hydrateDomains();

    }, [domains, dispatch]);

    return null;
}
