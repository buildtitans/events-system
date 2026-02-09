"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import GroupHeadSecton from "./groupHeadSection";
import { EventsPages } from "@/src/lib/store/slices/events/EventsSlice";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import EventsLayout from "../events/eventsLayout";
import { GroupHydrated } from "@/src/lib/store/slices/groups/OpenedGroupSlice";

type ViewGroupSectionProps = {
    status: GroupHydrated["status"],
    events: EventsPages,
    group: GroupSchemaType,
}

export default function ViewGroupSection({
    status,
    events,
    group,
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
                <EventsLayout
                    eventsPages={events}
                />
            </Box>
        </Box>
    )
}