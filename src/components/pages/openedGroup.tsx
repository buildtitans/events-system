"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { useGetGroupEvents } from "@/src/lib/hooks/init/useGetGroupEvents";
import type { UserInGroupRoleType } from "@/src/lib/types/tokens/types";
import GroupOranizerOnly from "../sections/group/GroupOrganizerOnly";
import { loadEventsPipeline } from "../pipelines/events/loadEventsPipeline";
import JoinGroupButton from "../ui/buttons/joinGroupButton";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";

type OpenedGroupProps = {
    groupID: string | null | undefined,
    roleType: UserInGroupRoleType,
    members: GroupMembersSchemaType[]
};

export default function OpenedGroup({ groupID, roleType, members }: OpenedGroupProps): JSX.Element {
    const { groupEvents, status } = useGetGroupEvents(groupID);


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

            <JoinGroupButton
                group_id={groupID}
                roleType={roleType}
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