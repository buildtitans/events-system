"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import type { LoadingStatus } from "@/src/lib/types/tokens/types";
import { loadEventsPipeline } from "../pipelines/events/loadEventsPipeline";
import GroupHeadSecton from "../sections/group/groupHeadSection";
import OpenedGroupSidebar from "../ui/drawers/openedGroupSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

type OpenedGroupProps = {
    status: LoadingStatus
};

export default function OpenedGroup({ status }: OpenedGroupProps): JSX.Element | null {
    const { events, group } = useSelector((s: RootState) => s.openGroup);
    const viewerKind = useSelector((s: RootState) => s.groupMembers.accessPermissions[group?.id ?? ""])
    const userKind = useSelector((s: RootState) => s.auth.userKind);

    if (!group) return null;

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
                status={status}
                pages={events}
                groupName={group?.name}
            />

            <OpenedGroupSidebar
                status={status}
                group_id={group.id}
                open={userKind === "authenticated"}
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
                {loadEventsPipeline(status, events)}
            </Box>
        </Box>
    )
}