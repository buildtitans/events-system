"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import GroupHeadSecton from "./groupHeadSection";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { RenderEventsForGroup } from "../../pipelines/groups/renderEventsForGroup";
import { HydratedEventsForOpenedGroup } from "@/src/lib/store/slices/groups/OpenedGroupSlice";

type ViewGroupSectionProps = {
    events: HydratedEventsForOpenedGroup,
    group: GroupSchemaType,
}

export default function ViewGroupSection({
    events,
    group,
}: ViewGroupSectionProps): JSX.Element {

    console.log(events)

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
                eventsForGroupStatus={events.status}
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
                <RenderEventsForGroup events={events} />
            </Box>
        </Box>
    )
}