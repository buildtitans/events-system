"use client";
import { LinearIndeterminate } from "../../ui/feedback";
import ViewGroupSection from "../../sections/group/viewGroupSection";
import type { JSX } from "react";
import type { GroupHydrated, HydratedEventsForOpenedGroup } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import NoGroups from "../../ui/feedback/failure/noGroups";
import Container from "@mui/material/Container";

type RenderOpenedGroupProps = {
    group: GroupHydrated,
    events: HydratedEventsForOpenedGroup
};

export function RenderOpenedGroup({
    group,
    events
}: RenderOpenedGroupProps
): JSX.Element | null {

    switch (group.status) {

        case "idle":
            return null;
        case "pending":
            return (
                <Container
                    disableGutters
                    sx={{
                        height: '100svh',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <LinearIndeterminate
                    />
                </Container>

            )
        case "failed":
            return <NoGroups />
        case "ready":
            return (
                <ViewGroupSection
                    key="opened-group"
                    group={group.data}
                    events={events}
                />
            )
    }
}
