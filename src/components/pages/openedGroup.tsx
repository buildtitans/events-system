"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { useGetGroupEvents } from "@/src/lib/hooks/init/useGetGroupEvents";
import type { UserInGroupRoleType } from "@/src/lib/types/tokens/types";
import GroupOranizerOnly from "../sections/group/GroupOrganizerOnly";
import { loadEventsPipeline } from "../pipelines/events/loadEventsPipeline";
import JoinGroup from "../ui/buttons/joinGroupButton";
import { useGetGroupMembers } from "@/src/lib/hooks/init/useGetGroupMembers";

type OpenedGroupProps = {
    groupID: string | null | undefined, roleType: UserInGroupRoleType
}

export default function OpenedGroup({ groupID, roleType }: OpenedGroupProps): JSX.Element {
    const { groupEvents, status } = useGetGroupEvents(groupID);
    const { members } = useGetGroupMembers(groupID);

    return (
        <Box
            component={"section"}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                mt: 10,
                minHeight: '100vh'
            }}
        >

            <JoinGroup
                members={members}
                group_id={groupID}
            />

            <GroupOranizerOnly
                roleType={roleType}
            />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {loadEventsPipeline(status, groupEvents)}
            </Box>
        </Box>
    )
}