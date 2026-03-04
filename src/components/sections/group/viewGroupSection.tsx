"use client";
import Box from "@mui/material/Box";
import type { JSX} from "react";
import GroupHeadSecton from "./groupHeadSection";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { RenderCurrentView } from "../../pipelines/groups/renderCurrentView";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

type ViewGroupSectionProps = {
    group: GroupSchemaType,
}


export default function ViewGroupSection({
    group,
}: ViewGroupSectionProps): JSX.Element {
    const displayed = useSelector((s: RootState) => s.openGroup.activeSection);


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
                {RenderCurrentView(displayed, group)}
            </Box>
        </Box>
    )
}