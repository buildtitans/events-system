"use client";
import { LinearIndeterminate } from "../../ui/feedback";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import type { EventsPages } from "@/src/lib/store/slices/EventsSlice";
import ViewGroupSection from "../../sections/group/viewGroupSection";
import type { JSX } from "react";
import type { GroupHydrated } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import NoGroups from "../../ui/feedback/failure/noGroups";

export function RenderOpenedGroup(
    { group, events }: { group: GroupHydrated; events: EventsPages }
): JSX.Element | null {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const status = useSelector((s: RootState) => s.openGroup.syncStatus);

    switch (group.status) {

        case "idle":
            return null;
        case "pending":
            return (
                <LinearIndeterminate
                />
            )
        case "failed":
            return <NoGroups />
        case "ready":
            return (
                <ViewGroupSection
                    key="opened-group"
                    userKind={userKind}
                    group={group.data}
                    events={events}
                    status={status}
                />
            )
    }
}
