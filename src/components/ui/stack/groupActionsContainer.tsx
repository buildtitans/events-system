"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { SidebarPipeline } from "../../pipelines/drawers/sidebarPipeline";

type GroupActonsContainerProps = {
    group_id: GroupSchemaType["id"],
}

export default function GroupActonsContainer({
    group_id,
}: GroupActonsContainerProps): JSX.Element | null {


    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                width: "100%",
                height: "auto",
                paddingY: 10,
                overflow: 'hidden'
            }}>
            {SidebarPipeline(group_id)}
        </Box>
    )
}