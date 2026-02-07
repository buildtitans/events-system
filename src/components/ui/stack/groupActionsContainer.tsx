"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { LoadingStatus } from "@/src/lib/types/tokens/types";
import { sidebarPipeline } from "../../pipelines/drawers/sidebarPipeline";

type GroupActonsContainerProps = {
    group_id: GroupSchemaType["id"],
    status: LoadingStatus
}

export default function GroupActonsContainer({
    group_id,
    status
}: GroupActonsContainerProps): JSX.Element | null {

    if (status === "pending") return null;

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
            {sidebarPipeline(group_id)}
        </Box>
    )
}