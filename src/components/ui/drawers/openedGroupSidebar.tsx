"use client";
import Drawer from "@mui/material/Drawer";
import type { JSX } from "react";
import type { LoadingStatus, UserInGroupRoleType } from "@/src/lib/types/tokens/types";
import GroupActonsContainer from "../stack/groupActionsContainer";
import { groupSidebarStyles } from "@/src/lib/tokens/sxTokens";
import { AnimatePresence } from "framer-motion";
import Skeleton from "@mui/material/Skeleton";
import FadeInOutBox from "../box/fadeInOutBox";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { GroupSchemaType } from "@/src/schemas/groupSchema";

type GroupSidebarProps = {
    status: LoadingStatus,
    open: boolean
    group_id: GroupSchemaType["id"]
}

export default function OpenedGroupSidebar({
    status,
    open,
    group_id

}: GroupSidebarProps): JSX.Element | null {
    const userKind = useSelector((s: RootState) => s.auth.userKind);

    if (userKind === "anonymous") return null;

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            open={open}
            transitionDuration={{ enter: 300, exit: 250 }}
            sx={{
                height: '100%',
            }}
            slotProps={{
                paper: {
                    sx: groupSidebarStyles,
                    elevation: 0
                }
            }}
        >
            {(status === "pending") && (
                <SidebarSkeleton key={"sidebar-skeleton"} />)}

            <GroupActonsContainer
                status={status}
                group_id={group_id}
            />
        </Drawer>
    )
}


function SidebarSkeleton() {


    return (

        <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height="100%"
            sx={{
                bgcolor: 'rgba(255, 255, 255, 0.03)'
            }}
        />

    )
}