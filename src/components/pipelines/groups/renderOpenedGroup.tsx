"use client";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";
import { LinearIndeterminate } from "../../ui/feedback";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import type { EventsPages } from "@/src/lib/store/slices/EventsSlice";
import ViewGroupSection from "../../sections/group/viewGroupSection";
import type { JSX } from "react";

export function RenderOpenedGroup(
    { group, events }: { group: GroupSchemaType | null; events: EventsPages }
): JSX.Element {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const status = useSelector((s: RootState) => s.openGroup.syncStatus);

    if (!group) return <LinearIndeterminate />;

    return (
        <ViewGroupSection
            key="opened-group"
            userKind={userKind}
            group={group}
            events={events}
            status={status}
        />
    );
}
