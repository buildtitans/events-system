"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import type { LoadingStatus, UserInGroupRoleType } from "@/src/lib/types/tokens/types";
import GroupOranizerOnly from "../../sections/group/GroupOrganizerOnly";
import JoinGroupButton from "@/src/components/ui/buttons/joinGroupButton";
import FadeInOutBox from "@/src/components/ui/box/fadeInOutBox";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { AnimatePresence } from "framer-motion";
import { EventsPages } from "@/src/lib/store/slices/EventsSlice";
import GroupActonsContainer from "../../ui/stack/groupActionsContainer";
import GroupEventsHeader from "./groupEventsHeader";

type GroupHeadSectionProps = {
    status: LoadingStatus,
    roleType: UserInGroupRoleType,
    group_id: GroupSchemaType["id"] | null | undefined,
    pages: EventsPages,
    groupName: GroupSchemaType["name"]
}


export default function GroupHeadSecton(
    {
        status,
        roleType,
        group_id,
        pages,
        groupName
    }: GroupHeadSectionProps): JSX.Element | null {


    return (
        <AnimatePresence>
            {((status === "idle") && (pages.length > 0)) && <FadeInOutBox styles={{ width: '100%' }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    justifyContent: 'center',
                    gap: 6,
                    width: '100%',
                }}>
                    <GroupActonsContainer
                        roleType={roleType}
                        status={status}
                        group_id={group_id}

                    />

                    <GroupEventsHeader
                        groupName={groupName}
                    />

                </Box>

            </FadeInOutBox>
            }
        </AnimatePresence>




    )
}