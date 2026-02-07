"use client";
import Box from "@mui/material/Box";
import { JSX, useEffect } from "react";
import type { LoadingStatus } from "@/src/lib/types/tokens/types";
import { loadEventsPipeline } from "../pipelines/events/loadEventsPipeline";
import GroupHeadSecton from "../sections/group/groupHeadSection";
import OpenedGroupSidebar from "../ui/drawers/openedGroupSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { syncOpenedGroup } from "@/src/lib/store/sync/syncOpenedGroup";
import { sync } from "framer-motion";


export default function OpenedGroup({ slug }: { slug: string }): JSX.Element | null {
    const { events, group } = useSelector((s: RootState) => s.openGroup);
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const status = useSelector((s: RootState) => s.openGroup.syncStatus);

    useEffect(() => {
        const syncGroup = async (): Promise<void> => {
            await syncOpenedGroup(slug);
        };

        void syncGroup();
    }, [slug]);


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