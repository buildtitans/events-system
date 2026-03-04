"use client";
import Box from "@mui/material/Box";
import { JSX, useState } from "react";
import GroupHeadSecton from "./groupHeadSection";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { RenderEventsForGroup } from "../../pipelines/groups/renderEventsForGroup";
import { RenderCurrentView } from "../../pipelines/groups/renderCurrentView";

type ViewGroupSectionProps = {
    group: GroupSchemaType,
}

export type ViewType = 'overview' | 'expanded event' | 'group events';

export default function ViewGroupSection({
    group,
}: ViewGroupSectionProps): JSX.Element {
    const [viewing, setViewing] = useState<ViewType>("overview");


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
                {RenderCurrentView(viewing, group)}
            </Box>
        </Box>
    )
}