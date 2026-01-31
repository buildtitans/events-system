"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { useMainContentPipelines } from "@/src/lib/hooks/rendering/useMainContentPipelines";
import { useGetGroupEvents } from "@/src/lib/hooks/init/useGetGroupEvents";
import type { UserInGroupRoleType } from "@/src/lib/types/tokens/types";
import GroupOranizerOnly from "../sections/group/GroupOrganizerOnly";
import GroupsPagesContainer from "../sections/group/groupsPages";
import EventsLayout from "../sections/events/eventsLayout";
import { group } from "console";
import { loadEventsPipeline } from "../pipelines/events/loadEventsPipeline";

type OpenedGroupProps = {
    groupID: string | null | undefined, roleType: UserInGroupRoleType
}

export default function OpenedGroup({ groupID, roleType }: OpenedGroupProps): JSX.Element {
    const { groupEvents, status } = useGetGroupEvents(groupID);


    return (
        <Box
            component={"section"}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                mt: 10,

            }}
        >
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