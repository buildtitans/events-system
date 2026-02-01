"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { useGetGroupEvents } from "@/src/lib/hooks/init/useGetGroupEvents";
import type { LoadingStatus, UserInGroupRoleType } from "@/src/lib/types/tokens/types";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";
import { loadEventsPipeline } from "../pipelines/events/loadEventsPipeline";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import GroupActonsContainer from "../ui/stack/groupActionsContainer";
import { AnimatePresence } from "framer-motion";
import GroupEventsHeader from "../sections/group/groupEventsHeader";
import Container from "@mui/material/Container";
import GroupHeadSecton from "../sections/group/groupHeadSection";
import { EventsPages } from "@/src/lib/store/slices/EventsSlice";

type OpenedGroupProps = {
    groupID: string | null | undefined,
    roleType: UserInGroupRoleType,
    members: GroupMembersSchemaType[],
    groupName: GroupSchemaType["name"],
    groupEvents: EventsPages,
    status: LoadingStatus
};

export default function OpenedGroup({ groupID, roleType, groupName, groupEvents, status }: OpenedGroupProps): JSX.Element {

    return (

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                minHeight: '100vh',
                width: '100%'
            }}
        >

            <GroupHeadSecton
                pages={groupEvents}
                roleType={roleType}
                status={status}
                group_id={groupID}
                groupName={groupName}
            />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: 'start',
                    justifyContent: 'center',
                    width: '100%',
                    minHeight: '70vh',
                }}
            >
                {loadEventsPipeline(status, groupEvents)}
            </Box>
        </Box>
    )
}