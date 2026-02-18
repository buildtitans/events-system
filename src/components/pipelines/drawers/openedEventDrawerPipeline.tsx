"use client";
import { shallowEqual, useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import RenderEventDrawerContents from "./renderEventDrawer";
import DrawerSpinner from "../../ui/feedback/pending/drawerSpinner";
import { JSX } from "react";
import { NoEventsFound } from "../../ui/box/fallbacks/noEventsFound";
import { useHydrateEventDrawer } from "@/src/lib/hooks/hydration/useHydrateEventDrawer";


export default function OpenedEventDrawerPipeline(): JSX.Element | null {
    useHydrateEventDrawer();
    const openedEvent = useSelector((s: RootState) => s.eventDrawer.event);
    const permissions = useSelector((s: RootState) => s.groupMembers.accessPermissions);
    const { numberAttending, numberInterested, groupName } = useSelector((s: RootState) => s.eventDrawer, shallowEqual);


    switch (openedEvent.status) {
        case "ready":
            return (
                <RenderEventDrawerContents
                    role={permissions[openedEvent.data.group_id]}
                    event={openedEvent.data}
                    numAttendants={numberAttending}
                    numInterested={numberInterested}
                    name={groupName}
                />
            );

        case "idle":
            return null;

        case "failed":
            return (
                <NoEventsFound />
            )

        default: {
            return (
                <DrawerSpinner />
            )
        }
    }

}