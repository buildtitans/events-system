"use client";
import { JSX } from "react";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { SidebarActionsPipeline } from "@/src/components/pipelines/drawers/interfaces/sidebarActionsPipeline";
import LocalGroupNav from "./localGroupNav";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";

type GroupActonsContainerProps = {
    group_id: GroupSchemaType["id"],
}

export default function GroupActonsContainer({
    group_id,
}: GroupActonsContainerProps): JSX.Element | null {
    const role = useSelector((s: RootState) => s.viewer.viewerRole);

    return (
            <Toolbar 
            disableGutters
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: 'center',
                alignItems: "center",
                width: "100%",
                height: "auto",

            }}>
                <LocalGroupNav>
            <Divider />
            <SidebarActionsPipeline
            group_id={group_id}
            role={role}
            />
            </LocalGroupNav>
            </Toolbar>
    )
}