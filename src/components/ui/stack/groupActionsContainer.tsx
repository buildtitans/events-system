"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { renderGroupSidebarContents } from "../../pipelines/drawers/renderGroupSidebarContents";
import { LoadingStatus } from "@/src/lib/types/tokens/types";

type GroupActonsContainerProps = {
    group_id: GroupSchemaType["id"],
    status: LoadingStatus
}

export default function GroupActonsContainer({
    group_id,
    status
}: GroupActonsContainerProps): JSX.Element | null {
    const viewerAccess = useSelector((s: RootState) => s.groupMembers.accessPermissions[group_id]);
    const content = renderGroupSidebarContents(viewerAccess, group_id);

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
            {content}
        </Box>
    )
}