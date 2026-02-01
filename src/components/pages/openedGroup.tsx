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
import OpenedGroupSidebar from "../ui/drawers/openedGroupSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

type OpenedGroupProps = {
    groupID: string | null | undefined,
    roleType: UserInGroupRoleType,
    members: GroupMembersSchemaType[],
    groupName: GroupSchemaType["name"],
    groupEvents: EventsPages,
    status: LoadingStatus
};

export default function OpenedGroup({ groupID, roleType, groupName, groupEvents, status, members }: OpenedGroupProps): JSX.Element {
    const userKind = useSelector((s: RootState) => s.auth.userKind);

    //TODO: with trpcClient + dbClient wired for event attendants, 
    // display the attendees of each event (if there are any)
    //TODO: add a button to allow authenticated users (userKind === "authenticated") 
    // the ability to change their attendance status
    // ———> attendance status being ' "going" | "not_going" | "interested"

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
                pages={groupEvents}
                groupName={groupName}
            />

            <OpenedGroupSidebar
                roleType={roleType}
                status={status}
                groupID={groupID}
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
                {loadEventsPipeline(status, groupEvents)}
            </Box>
        </Box>
    )
}