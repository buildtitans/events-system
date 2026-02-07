"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { signalDomainStatus } from "@/src/lib/store/slices/RenderingSlice";
import { useEffect } from "react";
import { DomainStateType } from "@/src/lib/store/sync/syncDomains";
import { getAllGroups } from "@/src/lib/store/slices/GroupsSlice";
import { chunkEventPages } from "@/src/lib/store/slices/EventsSlice";
import { getViewerPermissions } from "@/src/lib/store/slices/GroupMembersSlice";
import { getAllCategories } from "@/src/lib/store/slices/CategorySlice";


export default function DomainHydrator(
    {
        domains
    }: {
        domains: DomainStateType
    }
): React.ReactNode {
    const dispatch = useDispatch<AppDispatch>();

    async function dispatchDomains(
        events: DomainStateType["events"],
        groups: DomainStateType["groups"],
        access: DomainStateType["access"],
        categories: DomainStateType["categories"]
    ): Promise<void> {

        dispatch(getAllGroups(groups));
        dispatch(chunkEventPages(events));
        dispatch(getViewerPermissions(access));
        dispatch(getAllCategories(categories));
    };

    useEffect(() => {
        if (!domains) return;

        const hydrateDomains = async () => {
            dispatch(signalDomainStatus("pending"));

            const {
                events,
                groups,
                access,
                categories
            } = domains;

            await dispatchDomains(
                events,
                groups,
                access,
                categories
            );

            dispatch(signalDomainStatus("idle"));
        };

        void hydrateDomains();

    }, [domains, dispatch]);

    return null;
}
