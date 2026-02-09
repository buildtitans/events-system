"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import type { LoadingStatus } from "@/src/lib/types/tokens/types";
import { loadEventsPipeline } from "../../pipelines/events/loadEventsPipeline";
import GroupHeadSecton from "./groupHeadSection";
import OpenedGroupSidebar from "../../ui/drawers/openedGroupSidebar";
import { EventsPages } from "@/src/lib/store/slices/events/EventsSlice";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { UserKind } from "@/src/lib/store/slices/auth/AuthSlice";

type ViewGroupSectionProps = {
    status: LoadingStatus,
    events: EventsPages,
    group: GroupSchemaType,
    userKind: UserKind
}

export default function ViewGroupSection({
    status,
    events,
    group,
    userKind
}: ViewGroupSectionProps): JSX.Element {


    return (

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                width: '100%'
            }}
        >

            <GroupHeadSecton
                status={status}
                pages={events}
                groupName={group.name}
            />

            <OpenedGroupSidebar
                status={status}
                group_id={group.id}
                open={userKind === "authenticated"}
            />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: "100%",
                    minWidth: '100%',
                    minHeight: '70vh',
                    height: '100%'
                }}
            >
                {loadEventsPipeline(status, events)}
            </Box>
        </Box>
    )
}