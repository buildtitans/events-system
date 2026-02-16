"use client";
import ViewGroupSection from "../../sections/group/viewGroupSection";
import type { JSX } from "react";
import type { GroupHydrated } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import NoGroup from "../../ui/feedback/failure/noGroups";
import Container from "@mui/material/Container";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";

type RenderOpenedGroupProps = {
    group: GroupHydrated,
};

export function RenderOpenedGroup({
    group,
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
                    <SimpleBackdrop />
                </Container>

            )
        case "failed":
            return <NoGroup />
        case "ready":
            return (
                <ViewGroupSection
                    key="opened-group"
                    group={group.data}
                />
            )
    }
}
