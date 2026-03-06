"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { SidebarPipeline } from "../../pipelines/drawers/sidebarPipeline";
import LocalGroupNav from "./localGroupNav";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Divider from "@mui/material/Divider";

type GroupActonsContainerProps = {
    group_id: GroupSchemaType["id"],
}

export default function GroupActonsContainer({
    group_id,
}: GroupActonsContainerProps): JSX.Element | null {
    const role = useSelector((s: RootState) => s.groupMembers.viewerRole);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: 'center',
                alignItems: "center",
                width: "100%",
                height: "auto",
                overflow: 'hidden'
            }}>
            <LocalGroupNav>
            <Divider />
            <SidebarPipeline 
            group_id={group_id}
            role={role}
            />
            </LocalGroupNav>
            
        </Box>
    )
}