"use client";
import Drawer from "@mui/material/Drawer";
import type { JSX } from "react";
import type { LoadingStatus, UserInGroupRoleType } from "@/src/lib/types/tokens/types";
import GroupActonsContainer from "../stack/groupActionsContainer";

type GroupSidebarProps = {
    groupID: string | null | undefined,
    roleType: UserInGroupRoleType,
    status: LoadingStatus,
    open: boolean

}

export default function OpenedGroupSidebar({
    status,
    roleType,
    groupID,
    open

}: GroupSidebarProps): JSX.Element {

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            open={open}
            transitionDuration={{ enter: 300, exit: 250 }}
            sx={{
                height: '100%',
            }}

            PaperProps={{
                elevation: 0,
                sx: {
                    width: "auto",
                    paddingX: 2,
                    backgroundColor: 'rgb(18, 18, 18)',
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "rgba(38, 38, 38, 0.7)"
                },
            }}
        >
            <GroupActonsContainer
                status={status}
                roleType={roleType}
                group_id={groupID}
            />
        </Drawer>
    )
}